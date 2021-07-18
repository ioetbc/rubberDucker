<script lang="ts">
  import { onMount } from 'svelte'
  import type { User } from '../types'
  import { io } from 'socket.io-client'

  export let user: User
  export let accessToken: string
  let text = ''
  let socket: any
  let chatMessage: any = []

  onMount(async () => {
    // post message to SidebarProvider with value of get-token
    tsvscode.postMessage({ type: 'get-token' })

    socket = io('http://localhost:3003')

    socket.on('connect', () => {
      socket.on('message-from-server', (message: string) => {
        chatMessage = [message, ...chatMessage]
      })
    })
  })

  const sendMessage = () => {
      socket.emit('message-from-client', text)
  }
</script>

<input bind:value={text} />

<button on:click={() => {
  sendMessage()
  text = ''
}}>send message</button>

<ul>
	{#each chatMessage as m}
		<li>
			{m}
		</li>
	{/each}
</ul>

