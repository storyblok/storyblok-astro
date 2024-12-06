<script>
  let count = 0;

  function add() {
    count += 1;
  }

  function subtract() {
    count -= 1;
  }

  export let blok
</script>

<div class="counter">
  <button on:click={subtract}>-</button>
  <pre>{ count }</pre>
  <button on:click={add}>+</button>
</div>
<div class="message">
  {blok.headline}
</div>

<style>
  .counter{
    display: grid;
    font-size: 2em;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 2em;
    place-items: center;
  }
  .message {
    text-align: center;
  }
</style>
