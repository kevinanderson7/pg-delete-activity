$(document).ready(handleReady);

function handleReady() {
  // Set up click listeners
  $('#submit').on('click', handleSubmit);
  $('#shoeDisplay').on('click', '#deleteButton', clickDeleteShoe);

  // Get data
  getShoes();
}
function clickDeleteShoe() {
  // console.log($(this).parent().parent().data('id'));

  const id = $(this).parent().parent().data('id');
  deleteShoe(id);
}

function handleSubmit() {
  console.log('clicking submit');

  const name = $('#name').val();
  const size = $('#size').val();
  const cost = $('#cost').val();

  const objectToSend = {
    name: name,
    size: size,
    cost: cost,
  };

  $.ajax({
    method: 'POST',
    url: '/shoes',
    data: objectToSend,
  })
    .then(function (response) {
      //database is updated, need to update DOM
      getShoes();
    })
    .catch(function (err) {
      console.log(err);
      alert('Something went wrong in POST');
    });
}

function getShoes() {
  $.ajax({
    method: 'GET',
    url: '/shoes',
  })
    .then(function (response) {
      console.log('getShoes - response', response);

      //Append Shoes
      appendShoeTable(response);
    })
    .catch(function (error) {
      console.log('getShoes - error', error);
      alert('something went wrong in GET');
    });
}

function appendShoeTable(shoes) {
  //empty old data
  $('#shoeDisplay').empty();

  for (let shoe of shoes) {
    console.log(shoe);
    //make a row with info
    let tableRow = $(`
    <tr>
      <td>${shoe.name}</td>
      <td>${shoe.cost}</td>
      <td>${shoe.size}</td>
      <td>
        <button id="deleteButton">
        DELETE
      </button>
    </tr>
    `);

    // attach data to row, need for delete
    tableRow.data('id', shoe.id);

    //append row to table
    $('#shoeDisplay').append(tableRow);
  }
}

function deleteShoe(shoeId) {
  $.ajax({
    type: 'DELETE',
    url: `/shoes/${shoeId}`,
  })
    .then((response) => {
      getShoes();
    })
    .catch((error) => {
      console.log('error: ', error);
      alert('Stuff broke!');
    });
}
