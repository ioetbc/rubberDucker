<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '../types';
  import Todos from './Todos.svelte';
  import Chat from './Chat.svelte';
  let accessToken = ''
  let loading = true
  let user: User
  let page: 'todos' | 'contact' = tsvscode.getState()?.page || 'todos'

  // like useEffect will be watching the page variable
  $: {
    tsvscode.setState({ page })
  }

  onMount(async () => {
    window.addEventListener('message', async event => {
        const message = event.data;
        switch (message.type) {
            case 'token':
              // fetches current user using the accessToken
              accessToken = message.value
              const response = await fetch(`https://rubber-ducker.herokuapp.com/me`, {
                headers: { authorization: `Bearer ${accessToken}`}
              })
              const data = await response.json()
              user = data.user
              loading = false
            break;
        }
    });

    // post message to SidebarProvider with value of get-token
    tsvscode.postMessage({ type: 'get-token' })
  })
</script>

{#if loading}
  <div>loading...</div>
{:else if user}
  <pre>{JSON.stringify(user, null, 2)}</pre>
  {#if page === 'todos'}
  <Chat {user} {accessToken}  />
  <button on:click={() => page = 'contact'}>go to contact page</button>
  {/if}
  {#if page === 'contact'}
    <p>this is the contact page</p>
    <button on:click={() => page = 'todos'}>go to todo page</button>
  {/if}
  <button on:click={() => {
    accessToken = ''
    user = null
    tsvscode.postMessage({ type: 'logout' })
  }}>logout</button>
{:else}
  <div>no user is logged in</div>
  <button on:click={() => {
      tsvscode.postMessage({ type: 'authenticate' })
  }}>login with github</button>
{/if}


