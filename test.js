let arr = ['mohammed', 'ahmed', 'messi', 'ronaldo']

let last = 'neymar'

arr.push(last)

console.log(arr)

arr.forEach((item, i) => {
    if (item == 'neymar') {
        arr.splice(i, 1)
    }
})

console.log(arr)
arr.push(last)
console.log(arr)