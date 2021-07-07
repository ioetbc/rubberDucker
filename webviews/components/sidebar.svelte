<script lang="ts">
  let todos: Array<{text: string, completed: boolean}> = [] 
  let text = ''
</script>

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














<style>
  div {
    color: red;
  }
  .complete {
    text-decoration: line-through;
  }
</style>

