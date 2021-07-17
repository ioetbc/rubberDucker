<script lang="ts">
    import { onMount } from 'svelte';
    import type { User } from '../types';
    export let user: User
    export let accessToken: string
    let todos: Array<{text: string, completed: boolean, id: number }> = [] 
    let text = ''

    const addTodo = async (message: string) => {
      const data = await fetch(`${apiBaseUrl}/todo`, {
        method: 'POST',
        body: JSON.stringify({ text: message }),
        headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}`}
      })

      const { todo } = await data.json()
      todos = [todo, ...todos]
    }

    const completeTodo = async (todo: any) => {
      await fetch(`${apiBaseUrl}/todo`, {
        method: 'PUT',
        body: JSON.stringify({ id: todo.id }),
        headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}`}
      })
    }

    onMount(async () => {
        window.addEventListener('message', async event => {
            const message = event.data;
            switch (message.type) {
                case 'new-todo':
                  await addTodo(message.value)
            }
        });

        const data = await fetch(`${apiBaseUrl}/todo`, {
          headers: { authorization: `Bearer ${accessToken}`}
        })

        const payload = await data.json()
        todos = payload.todos

    // post message to SidebarProvider with value of get-token
    tsvscode.postMessage({ type: 'get-token' })
  })
</script>

{#if user}
    <h1>hello {user.name}</h1>
{/if}

<input bind:value={text} />

<button on:click={() => {
  addTodo(text)
  text = ''
}}>post</button>

<ul>
  {#each todos as todo (todo.id)}
    <li class:complete={todo.completed} on:click={() => {
      todo.completed = !todo.completed
      completeTodo(todo)
    }}>
      {todo.text}
    </li>
  {/each}
</ul>

<style>
  .complete {
    text-decoration: line-through;
  }
</style>

