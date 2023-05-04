export function smt_sevendays_maintence(row,rowcell) {
    let totalDays, diffDate
    let myDate_1 = Date.parse(new Date().format('Y-m-d'))
    let myDate_2 = Date.parse(row.value)
    diffDate = Math.abs(myDate_2 - myDate_1)
    totalDays = Math.floor(diffDate / (1000 * 3600 * 24))
    return {
        backgroundColor: totalDays < 7 ? "rgba(255, 0, 0, 0.82)" : rowcell.backgroundcolor,
        color: totalDays < 7 ? "white" :rowcell.color  ,
        fontSize: rowcell.fontsize + 'px',
        border: '0px solid ' + rowcell.backgroundcolor,
        height: rowcell.height + 'px',
        lineHeight: rowcell.height + 'px',
        padding: [0, 0, 0, 0],
        fontWeight: rowcell.fontweight,
    }
}