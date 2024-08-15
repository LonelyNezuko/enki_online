export default function returnJobNames(jobid) {
    const names = [ "-", "Фабрика одежды", "Водитель автобуса", "Таксист", "Шахтер", "Развозчик продуктов", "Армейский завод", "Дальнобойщик", "Механик", "Автозавод" ]

    if(jobid >= 3000 && jobid <= 3100)return `Транспортная компания #${jobid - 3000}`
    if(jobid >= names.length)return 'Неизвестно'
    
    return names[jobid]
}