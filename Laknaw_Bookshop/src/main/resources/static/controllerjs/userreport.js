const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4,
            borderWidth: 1
        }]
    },

});



const printUserReport = () => {

    let newTab = window.open();
    // let printView = "<head><title>Print User Report</title><link rel='stylesheet' href='resources/bootstrap-5.2.3/css/bootstrap.min.css'></head>"
    //     + "<body>" + "<h1>User report>/h1><br><img src='" + ctx.toDataURL() + "'/>"



    newTab.document.write(
        ''
        + '<script src="resources/script/jquery-3.7.1.js"></script>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">'
        + userTable.outerHTML + "<img src='" + ctx.toDataURL() + "'/>" +
        '<script> $(".modify-button").css("display","none")</script>'
    );

    setInterval(function () {
        newTab.print()
    }, 1000)
}