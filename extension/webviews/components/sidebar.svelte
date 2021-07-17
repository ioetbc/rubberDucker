<script lang="ts">
  import { onMount } from 'svelte';
  let accessToken = ''
  let todos: Array<{text: string, completed: boolean}> = [] 
  let text = ''
  let loading = true
  let user: { name: string; id: number } | null = null
  onMount(async () => {
    window.addEventListener('message', async event => {
        const message = event.data;
        switch (message.type) {
            case 'new-todo':
              todos = [
                { text: message.value, completed: false },
                ...todos
              ]
            case 'token':
              // fetches current user using the accessToken
              accessToken = message.value
              const response = await fetch(`${apiBaseUrl}/me`, {
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
{:else}
  <div>no user is logged in</div>
{/if}

<form on:submit|preventDefault={() => {
  todos = [{text: text, completed: false}, ...todos,]
  text = ''
}}>
  <input bind:value={text} />
</form>

<ul>
  {#each todos as todo (todo.text)}
    <li on:click={() => todo.completed = !todo.completed} class:complete={todo.completed}>
      {todo.text}
    </li>
  {/each}
</ul>


<button on:click={() => {
  tsvscode.postMessage({type: 'onInfo', value: 'info message'});
}}>click this for info</button>

<button on:click={() => {
  tsvscode.postMessage({type: 'onError', value: 'error message'});
}}>click this for error</button>

<style>
  div {
    color: red;
  }
  .complete {
    text-decoration: line-through;
  }
</style>

