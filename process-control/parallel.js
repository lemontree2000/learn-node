const fs = require('fs')
const tasks = []
const wordCounts = {}
const filesDir = __dirname + '/text'
let completedTasks = 0
// 检查是否完成
function checkIfComplete() {
    completedTasks++
    if (completedTasks === tasks.length) {
        for (let index in wordCounts) {
            console.log(`${index}: ${wordCounts[index]}`)
        }
    }
}
// 添加单词计数
function addWordCount(word) {
    wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1
}
// 从文本里面添加单词
function countWordsInText(text) {
    const words = text.toString().toLowerCase().split(/\W+/).sort();
    words.filter(word => word).forEach(word => addWordCount(word))
}
// 读取目录
fs.readdir(filesDir, (err, files) => {
    if(err) throw err;
    files.forEach(file => {
        const task = (file => {
            return () => {
                fs.readFile(file, (err, text) => {
                    if(err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                })
            }
        })(`${filesDir}/${file}`)
        tasks.push(task)
    })
    tasks.forEach(task => task());
})