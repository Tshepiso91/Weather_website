// Add event listener for form submission using AJAX
$(document).ready(function () {
  $('#weatherForm').submit(function (event) {
    event.preventDefault();
    const cityName = $('#cityInput').val();

    // Make AJAX request to handle form submission
    $.ajax({
      url: '/',
      type: 'POST',
      data: { cityName: cityName },
      success: function (data) {
        // Update the weather information without reloading the page
        $('#weatherInfo').html(data);
      },
      error: function (xhr, status, error) {
        console.log(error);
      }
    });
  });
});
