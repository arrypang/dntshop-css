var chartRevenue;
var chartProducts;
// top products
async function fetchChartDataProducts(filter, element) {
    const allItems = document.querySelectorAll('#chartFilterProducts li span');

    if (element) {
        allItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }

    var apiUrl = ``;
    const startDate = document.getElementById('start-dateProducts');
    const endDate = document.getElementById('end-dateProducts');
    const startDateValue = startDate.value
    const endDateValue = endDate.value
    const spanDate = document.getElementById('dateProducts');

    if (filter == 'date') {

        if (!startDateValue || !endDateValue) {
            alert('Vui lòng nhập ngày bắt đầu và ngày kết thúc.')
            return
        }

        if (new Date(startDateValue) > new Date(endDateValue)) {
            alert('ngày bắt đầu không lớn hơn ngày kết thúc')
            startDate.value = ''
            endDate.value = ''
            return
        }

        apiUrl = `/admin/api/top-products?filter=${filter}&startDate=${startDateValue}&endDate=${endDateValue}`;
        startDate.value = ''
        endDate.value = ''

        allItems.forEach(item => item.classList.remove('active'));
        if (spanDate) {
            $(spanDate).removeClass('hidden').addClass('active');

            var formattedStartDate = moment(startDateValue).format('DD/MM/YYYY');
            var formattedEndDate = moment(endDateValue).format('DD/MM/YYYY');

            $(spanDate).html(`${formattedStartDate} - ${formattedEndDate}`);
        }

    } else {
        $(spanDate).removeClass('active').addClass('hidden');
        apiUrl = `/admin/api/top-products?filter=${filter}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
            var options = {
                series: data.map(item => item.total_sales),
                chart: { type: 'polarArea', height: 325 },
                stroke: { colors: ['#ccc'] },
                fill: { opacity: 0.8 },
                labels: data.map(item => item.product_name),
                legend: { position: 'bottom' },
            }

            if (chartProducts) {
                chartProducts.destroy();
            }
            chartProducts = new ApexCharts(document.querySelector("#line-chart-7"), options);
            chartProducts.render();
        } else {
            if (chartProducts) {
                chartProducts.destroy();
            }
            return document.querySelector('#line-chart-7').innerHTML = `<h4 class="text-center">Không có dữ liệu</h4>`
        }


    } catch (error) {
        console.error("Error fetching sales data:", error);
    }

}


async function fetchChartDataRevenue(filter, element) {
    const allItems = document.querySelectorAll('#chartFilterRevenue li span');

    if (element) {
        allItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }

    var apiUrl = ``;
    const startDate = document.getElementById('start-dateRevenue');
    const endDate = document.getElementById('end-dateRevenue');
    const startDateValue = startDate.value
    const endDateValue = endDate.value
    const spanDate = document.getElementById('dateRevenue');

    if (filter == 'date') {

        if (!startDateValue || !endDateValue) {
            alert('Vui lòng nhập ngày bắt đầu và ngày kết thúc.')
            return
        }

        if (new Date(startDateValue) > new Date(endDateValue)) {
            alert('ngày bắt đầu không lớn hơn ngày kết thúc')
            startDate.value = ''
            endDate.value = ''
            return
        }

        apiUrl = `/admin/api/revenue?filter=${filter}&startDate=${startDateValue}&endDate=${endDateValue}`;
        startDate.value = ''
        endDate.value = ''

        allItems.forEach(item => item.classList.remove('active'));
        if (spanDate) {
            $(spanDate).removeClass('hidden').addClass('active');

            var formattedStartDate = moment(startDateValue).format('DD/MM/YYYY');
            var formattedEndDate = moment(endDateValue).format('DD/MM/YYYY');

            $(spanDate).html(`${formattedStartDate} - ${formattedEndDate}`);
        }

    } else {
        $(spanDate).removeClass('active').addClass('hidden');
        apiUrl = `/admin/api/revenue?filter=${filter}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let allZero = false;
        data.orderCount.forEach((value, item) => {
            if (value > 0) {
                allZero = true;
                return
            }
        })

        if (allZero) {
            // Extract data from the response
            const categories = data.categories;
            const revenueData = data.revenue;
            const orderCountData = data.orderCount;

            // Update the chart options with new data
            // var options = {
            //     series: [{
            //         name: 'Doanh thu',
            //         data: revenueData,
            //     }, {
            //         name: 'Đơn hàng',
            //         data: orderCountData,
            //     }],
            //     chart: {
            //         type: 'bar',
            //         height: 325,
            //         toolbar: {
            //             show: false,
            //         },
            //     },
            //     plotOptions: {
            //         bar: {
            //             horizontal: false,
            //             columnWidth: '10px',
            //             endingShape: 'rounded'
            //         },
            //     },
            //     xaxis: {
            //         categories: categories,
            //         labels: {
            //             style: {
            //                 colors: '#212529',
            //             },
            //         },
            //     },
            //     yaxis: [{
            //         labels: {
            //             formatter: function (val) {
            //                 if (val >= 1000000) {
            //                     return (val / 1000000).toFixed(1).replace('.0', '') + 'tr'; // Hiển thị triệu, bỏ .0 nếu không có số lẻa
            //                 } else if (val >= 1000) {
            //                     return (val / 1000).toFixed(1).replace('.0', '') + 'k'; // Hiển thị nghìn, bỏ .0 nếu không có số lẻ
            //                 }
            //                 return val; // Hiển thị giá trị gốc nếu nhỏ hơn 1000
            //             }
            //         },
            //     }, {
            //         opposite: true,
            //         labels: {
            //             formatter: function (val) {
            //                 return Math.round(val);
            //             },
            //         },
            //     }],
            //     dataLabels: {
            //         enabled: false,
            //     },
            //     colors: ['#2377FC', '#FFA500'],
            //     fill: {
            //         opacity: 1
            //     },
            //     tooltip: {
            //         y: {
            //             formatter: function (val, { seriesIndex }) {
            //                 if (seriesIndex === 0) { // Revenue
            //                     return Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
            //                 } else if (seriesIndex === 1) { // Orders
            //                     return Math.round(val) + ' đơn';
            //                 }
            //             }
            //         }
            //     }
            // };

            var options = {
                series: [{
                    name: 'Doanh thu',
                    type: 'column',
                    data: revenueData,
                }, {
                    name: 'Đơn hàng',
                    type: 'column',
                    data: orderCountData,
                }], chart: {
                    type: 'bar',
                    height: 350
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '100%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: categories,

                },
                yaxis: [{
                    labels: {
                        formatter: function (val) {
                            if (val >= 1000000) {
                                return (val / 1000000).toFixed(1).replace('.0', '') + 'tr'; // Hiển thị triệu, bỏ .0 nếu không có số lẻa
                            } else if (val >= 1000) {
                                return (val / 1000).toFixed(1).replace('.0', '') + 'k'; // Hiển thị nghìn, bỏ .0 nếu không có số lẻ
                            }
                            return val; // Hiển thị giá trị gốc nếu nhỏ hơn 1000
                        },
                    },
                }, {
                    opposite: true,
                }]
            };

            if (chartRevenue) {
                chartRevenue.destroy();
            }
            chartRevenue = new ApexCharts(document.querySelector("#line-chart-8"), options);
            chartRevenue.render();
        } else {
            if (chartRevenue) {
                chartRevenue.destroy();
            }
            return document.querySelector('#line-chart-8').innerHTML = `<h4 class="text-center">Không có dữ liệu</h4>`
        }
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

window.onload = () => fetchChartDataRevenue('yearly'), fetchChartDataProducts('yearly');


