

$('.browwse').click(function () {
    $("#load-grid").click();

});

$(function () {

    new function () {

        this.load_grid = function () {

            /* alert('dfsdf');*/
            this.dc_serialized_data = null; {
                var fileToLoad = document.getElementById("load-grid").files[0];

                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    /* this.grid = $('.grid-stack').data('gridstack');*/

                    this.dc_serialized_data = /*JSON.parse*/ (fileLoadedEvent.target.result);
                  
                    OnTstructLoadTest(fileLoadedEvent.target.result);
                   


                };
                fileReader.readAsText(fileToLoad);
            }


            $j("#middle1", parent.document).height(1000);


        }.bind(this);

        $('#load-grid').change(this.load_grid);


    };

});