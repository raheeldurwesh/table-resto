
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    console.log('[Superadmin] New request received')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // 1. Verify Caller
    if (!authHeader) {
      console.error('[Superadmin] Missing Authorization header')
      return new Response(JSON.stringify({ error: 'Unauthorized', detail: 'Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      console.error('[Superadmin] Auth error from getUser():', userError?.message || 'No user found')
      return new Response(JSON.stringify({ error: 'Unauthorized', detail: userError?.message || 'Invalid session' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log(`[Superadmin] Caller identified: ${user.email} (ID: ${user.id})`)

    // Fetch caller's profile
    const { data: callerProfile, error: profileErr } = await supabaseClient
      .from('profiles')
      .select('role, restaurant_id')
      .eq('id', user.id)
      .maybeSingle()

    if (profileErr) console.warn('[Superadmin] Profile fetch warning:', profileErr.message)

    // Exhaustive role check
    const callerRole = callerProfile?.role 
                    || user.app_metadata?.role 
                    || user.user_metadata?.role

    const callerRestaurantId = callerProfile?.restaurant_id 
                            || user.user_metadata?.restaurant_id 
                            || user.app_metadata?.restaurant_id

    console.log(`[Superadmin] Role Logic: Profile(${callerProfile?.role}) AppMeta(${user.app_metadata?.role}) UserMeta(${user.user_metadata?.role}) -> Result: ${callerRole}`)

    // 2. Parse Body
    const bodyText = await req.text()
    console.log('[Superadmin] Raw body length:', bodyText.length)
    let action, payload
    try {
      const body = JSON.parse(bodyText)
      action = body.action
      payload = body.payload
    } catch (e) {
      console.error('[Superadmin] JSON parse error:', e.message)
      return new Response(JSON.stringify({ error: 'Bad Request', detail: 'Invalid JSON body' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    if (!action) throw new Error('action is required')
    console.log(`[Superadmin] Executing Action: ${action}`)

    // 3. Authorization Logic
    const isSuperAdmin = callerRole === 'super_admin'
    const isAdmin = callerRole === 'admin'

    if (!isSuperAdmin && !isAdmin) {
      console.warn(`[Superadmin] Access DENIED for role: ${callerRole}`)
      return new Response(JSON.stringify({ 
        error: 'Forbidden', 
        detail: `Insufficient permissions. Your role '${callerRole}' does not have administrative access.`,
        received_role: callerRole 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    // Restricted actions for Restaurant Admins
    const adminAllowedActions = ['create-user', 'reset-password', 'delete-user', 'toggle-user-status', 'force-logout']
    
    if (isAdmin && !isSuperAdmin) {
      if (!adminAllowedActions.includes(action)) {
        console.warn(`[Superadmin] Admin tried restricted action: ${action}`)
        return new Response(JSON.stringify({ error: 'Forbidden', detail: `Restaurant admins cannot perform '${action}'` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        })
      }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    let result: any = { success: true }

    // 4. Helper: Verify Target User ownership (for Admins)
    const verifyOwnership = async (targetUserId: string) => {
      if (isSuperAdmin) {
        console.log('[Superadmin] verifyOwnership: Superadmin bypass')
        return true
      }
      console.log(`[Superadmin] verifyOwnership: checking target ${targetUserId} vs caller restaurant ${callerRestaurantId}`)
      const { data: targetProfile, error: tErr } = await supabaseAdmin
        .from('profiles')
        .select('restaurant_id')
        .eq('id', targetUserId)
        .maybeSingle()
      
      if (tErr) console.error('[Superadmin] Target profile fetch error:', tErr.message)
      
      if (!targetProfile || targetProfile.restaurant_id !== callerRestaurantId) {
        console.warn(`[Superadmin] Ownership violation: target(${targetProfile?.restaurant_id}) vs caller(${callerRestaurantId})`)
        throw new Error('Forbidden: Target user does not belong to your restaurant.')
      }
      return true
    }

    // 5. Handle Actions
    console.log(`[Superadmin] Processing switch for: ${action}`)
    switch (action) {
      case 'toggle-restaurant-status': {
        if (!isSuperAdmin) throw new Error('Forbidden: Superadmin only')
        const { restaurant_id, set_active } = payload
        const { error: rErr } = await supabaseAdmin
          .from('restaurants')
          .update({ is_active: set_active })
          .eq('id', restaurant_id)
        if (rErr) throw rErr

        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id, email, role')
          .eq('restaurant_id', restaurant_id)
        
        const isDisabled = !set_active
        if (profiles) {
          for (const p of profiles) {
            if (p.role === 'super_admin') continue
            await supabaseAdmin.auth.admin.updateUserById(p.id, {
              ban_duration: set_active ? 'none' : '876000h',
            })
            await supabaseAdmin.from('profiles').update({ is_disabled: isDisabled }).eq('id', p.id)
          }
        }
        break
      }

      case 'delete-restaurant': {
        if (!isSuperAdmin) throw new Error('Forbidden: Superadmin only')
        const { restaurant_id } = payload
        if (!restaurant_id) throw new Error('restaurant_id required')
        
        await supabaseAdmin.from('menu').delete().eq('restaurant_id', restaurant_id)
        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('restaurant_id', restaurant_id)
        
        if (profiles) {
          for (const p of profiles) {
            await supabaseAdmin.from('profiles').delete().eq('id', p.id)
            await supabaseAdmin.auth.admin.deleteUser(p.id)
          }
        }

        const { error: dErr } = await supabaseAdmin.from('restaurants').delete().eq('id', restaurant_id)
        if (dErr) throw dErr
        break
      }

      case 'toggle-user-status': {
        const { user_id, disable } = payload
        await verifyOwnership(user_id)
        
        const { error: aErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
          ban_duration: disable ? '876000h' : 'none',
        })
        if (aErr) throw aErr
        await supabaseAdmin.from('profiles').update({ is_disabled: !!disable }).eq('id', user_id)
        break
      }

      case 'delete-user': {
        const { user_id } = payload
        await verifyOwnership(user_id)

        await supabaseAdmin.from('profiles').delete().eq('id', user_id)
        const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(user_id)
        if (delErr) throw delErr
        break
      }

      case 'reset-password': {
        const { user_id, new_password } = payload
        await verifyOwnership(user_id)

        const { error: passErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
          password: new_password,
        })
        if (passErr) throw passErr
        break
      }

      case 'create-user': {
        const { email, password, role, restaurant_id } = payload
        
        // Security check for Admins
        if (isAdmin && !isSuperAdmin) {
          if (restaurant_id !== callerRestaurantId) {
            throw new Error('Forbidden: Cannot create user for another restaurant.')
          }
          if (role !== 'waiter' && role !== 'admin') {
            throw new Error('Forbidden: Restricted role creation.')
          }
        }

        const { data: newUser, error: cErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role, restaurant_id }
        })
        if (cErr) throw cErr
        
        await supabaseAdmin.from('profiles').upsert({
          id: newUser.user.id,
          email,
          role,
          restaurant_id
        }, { onConflict: 'id' })
        
        result.user_id = newUser.user.id
        break
      }

      case 'force-logout': {
        const { user_id, restaurant_id } = payload
        
        if (restaurant_id) {
          if (isAdmin && !isSuperAdmin && restaurant_id !== callerRestaurantId) {
            throw new Error('Forbidden: Cannot target another restaurant.')
          }
          const { data: ps } = await supabaseAdmin.from('profiles').select('id').eq('restaurant_id', restaurant_id)
          if (ps) {
            for (const p of ps) {
              await supabaseAdmin.auth.admin.updateUserById(p.id, {
                app_metadata: { force_logout_at: Date.now() }
              })
            }
          }
        } else if (user_id) {
          await verifyOwnership(user_id)
          await supabaseAdmin.auth.admin.updateUserById(user_id, {
            app_metadata: { force_logout_at: Date.now() }
          })
        }
        break
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    console.log('[Superadmin] Action completed successfully')
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('[Superadmin] Critical error:', error.message)
    return new Response(JSON.stringify({ error: error.message, detail: error.stack }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })



  }
})
