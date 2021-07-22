<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '../types';
  import Todos from './Todos.svelte';
  import Chat from './Chat.svelte';
  let accessToken = ''
  let loading = true
  let user: User
  let allUsers: User[]
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
              allUsers = [
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                },
                {
                  id: 11,
                  user_name: "ioetbc",
                  github_id: "24758676",
                  avatar: "https://avatars.githubusercontent.com/u/24758676?v=4"
                }
              ]
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
  {#if allUsers.length}
  <div class="avatar-container">
    {#each allUsers as user}
    <div class="avatar-item">
      <img class="avatar" src={user ? user.avatar : ''} alt="avatar" />
      <pre>{user ? user.user_name : ''}</pre>
    </div>
    {/each}
  </div>
  {/if}

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

<style>
  .avatar-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 8px;
    justify-content: space-around;
  }
  .avatar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    padding: 12px 6px 0;
    cursor: pointer;
  }
  .avatar-item:hover {
    background: #2d2d2d;
  }
  .avatar {
    width: 40px;
    border-radius: 50%;
    border: 3px solid lime;
  }
</style>