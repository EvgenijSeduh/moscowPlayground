async function getData() {
    try {
        const response = await fetch('https://apidata.mos.ru/v1/datasets/893/rows?api_key=353e7e0b-c871-4768-b454-45edf006d983&$top=1903');

        console.log(response.status); // Выводит статус-код HTTP-ответа

        if (!response.ok) {
            throw new Error('Ошибка при запросе данных');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
//https://jsonplaceholder.typicode.com/posts
//https://apidata.mos.ru/v1/datasets/893/rows?api_key=353e7e0b-c871-4768-b454-45edf006d983


async function main() {//главная функция
    const postsData = await getData();
    let currentPage = 1;
    let rows = 65;

    const form = document.querySelector("form");
    const searchInput = document.querySelector('.form-control');

    // Для поиска

    form.addEventListener('input', (e) => {
        e.preventDefault();

        let searchedData = [];

        postsData.forEach(record => {
            let toChek = record.Cells.NameWinter.toLowerCase();

            if (toChek.includes(searchInput.value.toLowerCase())) {
                searchedData.push(record);
            }
        });

        displayList(searchedData, rows, currentPage);
        displayPagination(searchedData, rows);
    });

    const filterArea = document.querySelectorAll('.filterArea');
    const fieldsInObjectAndFilterArea = {//соотношениеполя и название в json
        equipmentFilter: 'HasEquipmentRental',
        lockerRoomFilter: 'HasDressingRoom',
        foodFilter: 'HasEatery',
        toiletFilter: 'HasToilet',
        wifiFilter: 'HasWifi',
        lightFilter: 'Lighting',
        priceFilter: 'Paid',
        disabledFilter: 'DisabilityFriendly'
    };


    const filter = {};//список фильтров

    filterArea.forEach(area => {//фильтрация
        area.addEventListener('change', function () {
            if (this.value == "not chanche") {
                delete filter[fieldsInObjectAndFilterArea[this.id]];
            } else {
                filter[fieldsInObjectAndFilterArea[this.id]] = this.value;
            }
            if (Object.keys(filter).length > 0) {
                const result = [];
                postsData.forEach(el => {
                    let flag = true;
                    for (const filterPoin in filter) {
                        if (el.Cells[filterPoin] != filter[filterPoin]) {
                            console.log(el.Cells[filterPoin], filter[filterPoin]);
                            flag = false;
                        }
                    }
                    if (flag) {
                        result.push(el);
                    }
                })
                console.log(result)
                displayList(result, rows, currentPage);
                displayPagination(result, rows);
            }else{
                displayList(postsData, rows, currentPage);
                displayPagination(postsData, rows);
            }

        });
    });


    async function init() {//для карты
        let myMap = new ymaps.Map("map", {
            center: [55.751574, 37.573856],
            zoom: 14
        });


        postsData.forEach(el => {
            let coord = el.Cells.geoData.coordinates;
            let correctedCoord = [coord[1], coord[0]];

            var placemark = new ymaps.Placemark(correctedCoord, {
                hintContent: el.Cells.NameWinter,
                balloonContent: el.Cells.Address
            });
            placemark.events.add('click', function () {
                const playgroundId = el.global_id;
        
                // Формируем URL строку с передачей значения в параметр
                const url = '../php/card.html?id=' + playgroundId;
        
                window.open(url);
            });
        
            myMap.geoObjects.add(placemark);
        });
    }

    function displayList(arrData, rowPerPage, page) {//отображение таблицы и ее содержимого
        const postsEl = document.querySelector('.posts');
        const tableHeaderName = ["№", "Название", "Адрес", "Подробнее"];
        postsEl.innerHTML = "";
        page--;

        const start = rowPerPage * page;
        const end = start + rowPerPage;
        const paginatedData = arrData.slice(start, end);

        const postsTable = document.createElement('table');
        postsTable.classList.add('table', 'table-Light', 'listPlayground', 'table-striped', 'text-center');
        const postsTableHeader = document.createElement('thead');
        const postsTableBody = document.createElement('tbody');
        const postsTableHeaderRow = document.createElement('tr');

        for (const headerName of tableHeaderName) {
            const postsHeaderCell = document.createElement('th');
            postsHeaderCell.textContent = headerName;
            if (headerName == 'Адрес') {
                postsHeaderCell.classList.add('computer');
            }
            postsTableHeaderRow.appendChild(postsHeaderCell);
        }

        postsTableHeader.appendChild(postsTableHeaderRow);
        postsTable.appendChild(postsTableHeader);

        paginatedData.forEach(el => {
            const row = document.createElement('tr');

            const numberPlayground = document.createElement('td');
            numberPlayground.textContent = el.Number;

            const namePlayground = document.createElement('td');
            namePlayground.textContent = el.Cells.NameWinter;

            const addressPlayground = document.createElement('td');
            addressPlayground.textContent = el.Cells.AdmArea + ' ' + el.Cells.District + ' ' + el.Cells.Address;
            addressPlayground.classList.add('computer')


            const buttonMore = document.createElement('button');
            buttonMore.textContent = 'Подробнее';
            buttonMore.classList.add('btn', 'btn-primary');

            buttonMore.addEventListener('click', function () {//слушатель кнопки
                const playgroundId = el.global_id;

                // Формируем URL строку с передачей значения в параметр
                const url = '../php/card.html?id=' + playgroundId;

                window.open(url);
            });

            row.appendChild(numberPlayground);
            row.appendChild(namePlayground);
            row.appendChild(addressPlayground);

            const cellButton = document.createElement('td');
            cellButton.appendChild(buttonMore);
            row.appendChild(cellButton);

            postsTableBody.appendChild(row);
        });

        postsTable.appendChild(postsTableBody);

        postsEl.appendChild(postsTable);
    }

    function displayPagination(arrData, rowPerPage) {//отображение всей пагинации(номеров)
        const paginationEl = document.querySelector('.pagination');
        paginationEl.innerHTML = "";
        const pagesCount = Math.ceil(arrData.length / rowPerPage);
        const ulEl = document.createElement("ul");
        ulEl.classList.add('pagination__list');
        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1);
            ulEl.appendChild(liEl);
        }
        paginationEl.appendChild(ulEl);
    }

    function displayPaginationBtn(page) {//отображение отдельных номеров страниц
        const liEl = document.createElement("li");
        liEl.classList.add('pagination__item');
        liEl.innerText = page;

        liEl.addEventListener('click', () => {
            currentPage = page;
            displayList(postsData, rows, currentPage);
        })

        return liEl;
    }

    displayList(postsData, rows, currentPage);
    displayPagination(postsData, rows);
    ymaps.ready(init);

}
main();










