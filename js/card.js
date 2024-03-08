async function getDataForId(id) {
    try {
        const response = await fetch('https://apidata.mos.ru/v1/datasets/893/rows?api_key=353e7e0b-c871-4768-b454-45edf006d983&q=' + id);

        console.log(response.status); // Выводит статус-код HTTP-ответа

        if (!response.ok) {
            throw new Error('Ошибка при запросе данных');
        }

        const data = await response.json();
        return data[0].Cells; // Возвращаем только первый элемент данных (первую запись)
    } catch (error) {
        console.error(error);
    }
}


async function getDataForColumsName() {
    try {
        const response = await fetch('https://apidata.mos.ru/v1/datasets/893?api_key=353e7e0b-c871-4768-b454-45edf006d983&');

        console.log(response.status); // Выводит статус-код HTTP-ответа

        if (!response.ok) {
            throw new Error('Ошибка при запросе данных');
        }

        const data = await response.json();
        return data.Columns; 
    } catch (error) {
        console.error(error);
    }
}

const searchParams = new URLSearchParams(window.location.search);
const playgroundId = searchParams.get('id');

async function main() {
    const tableHeaderName = await getDataForColumsName();
    const tableCellsInfo = await getDataForId(playgroundId);
    console.log(tableCellsInfo, tableCellsInfo.geoData.coordinates)

    async function init() {//для карты
        
        let coord = tableCellsInfo.geoData.coordinates;
        
        let correctedCoord = [coord[1], coord[0]];
        let myMap = new ymaps.Map("map", {
            center: correctedCoord,
            zoom: 14
        });

            var placemark = new ymaps.Placemark(correctedCoord, {
                hintContent: tableCellsInfo.NameWinter,
                balloonContent: tableCellsInfo.Address
            });

            myMap.geoObjects.add(placemark);
    }


    

    const mainInfo = document.querySelector(".mainInfo");

    const infoTable = document.createElement('table');
    infoTable.classList.add('table', 'table-Light', 'listPlayground', 'table-striped', 'text-center');
    const infoTableHeader = document.createElement('thead');
    const infoTableBody = document.createElement('tbody');
    const infoTableHeaderRow = document.createElement('tr');

    const infoHeaderСharacteristic= document.createElement('th');
    infoHeaderСharacteristic.textContent = 'Характеристика';
    infoTableHeaderRow.appendChild(infoHeaderСharacteristic);

    const infoHeaderAvailability = document.createElement('th');
    infoHeaderAvailability.textContent = 'Наличие';
    infoTableHeaderRow.appendChild(infoHeaderAvailability);


    for (const characteristic of tableHeaderName) {
        if (characteristic.Visible == true) {
          const row = document.createElement('tr');
          
          const cell1 = document.createElement('td');
          cell1.textContent = characteristic.Caption;
          row.appendChild(cell1);
          

          const cell2 = document.createElement('td');
          if (tableCellsInfo[characteristic.Name]) {
            cell2.textContent = tableCellsInfo[characteristic.Name];
          } else {
            cell2.textContent = '-';
          }
          row.appendChild(cell2);
          
          infoTableBody.appendChild(row);
        }
      }
      

    infoTable.appendChild(infoTableBody);
    mainInfo.appendChild(infoTable);
    ymaps.ready(init);

}
main();
