Programmatically delete comments via UI

```js
// add indices to comments
$$('div .Comment div[data-testid=comment-top-meta]').forEach((comment, i) => {
  let e = document.createElement('span');
  e.textContent = ' -- comment number: ' + i;  
  comment.appendChild(e);  
})

// array of indexes to keep
let keep = [0, 1, 2, 3, 4, 5, 7, 115]

$$('div .Comment .icon-overflow_horizontal').forEach((el, i) => {
  if (keep.includes(i)) {
    console.log('keeping', i);
  } else {
    el.click()
    $('span .icon-delete').parentElement.parentElement.click();
    $$('div[aria-modal=true] footer button')[1].click();
    console.log('deleted', i);
  }
})
```
