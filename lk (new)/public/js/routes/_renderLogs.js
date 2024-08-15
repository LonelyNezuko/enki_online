export default function _renderLogs(data)
{
    let dates = []
    data.forEach(item => dates.push(new Date(item.time)))



    // $('.body').append(`
    //     <div class="mainbox" style="margin-top: 70px;">
    //         <div class="mainbox-section">
    //             <h1>Логи</h1>
    //             <div class="mainbox-section-wrap" style="margin: 0;">
    //                 <div class="logs">
    //                     <header>
    //                         <h2>Всего логов: ${data.length}</h2>
    //                         <section>
    //                             <h3>Выбор даты:</h3>
    //                         </section>
    //                     </header>
    //                     <div class="logs-body">
    //                         <section>
    //                             <span>19.02.2021</span>
    //                             <span>Логи</span>
    //                         </section>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>`)
}
