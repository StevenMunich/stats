  // add subtract multiply divide and power 2 numbers.
  function containsOnlyNumbersAndSpaces(str) {
    return /^[0-9\s]+$/.test(str);
    }
    function getDataSet(){
        //verifies and stores dataset
        let text = textbox1.value;
         if(!containsOnlyNumbersAndSpaces(text)) {
        alert("Please enter only numbers and spaces in the dataset.");
        return;

    }
    const dataset = text.split(" ");
    return dataset;
    }

    var global_Mean, global_SD;
    
    function add(){
    
    //var dataSet = textbox1.value;
    var minValue = Number(textbox2.value);
    var maxValue = Number(textbox3.value);
    var totalRange = maxValue - minValue;
    var bounds = Number(textbox4.value);
    var amount_of_bounds = totalRange / bounds;
    var amountOfElements = 0; //is incremented /set during classification below

    
    const dataset = getDataSet();

    //set up the ranges
    const ranges = new Array(amount_of_bounds);   
    for(var i=0; i < amount_of_bounds; i++){
        ranges[i] = 0;
    }
    //clasify each element
    for(var element in dataset){
        var tempBounds = bounds;
        for(var i=0; i < amount_of_bounds; i++){
            if(dataset[element] < tempBounds){ //if element < upperBounds increment range
                ranges[i] += 1;
                break;
            }
            tempBounds += bounds;
        }//end inner - classification
        amountOfElements++;
    }//end outer
    
    //prints graph
    displayBarChart(bounds, ranges, minValue, amount_of_bounds);
    //printBarGraph(bounds, ranges, minValue);

    
    //Mean
    var mean = findMean(dataset, amountOfElements);
    global_Mean = mean; //for use later on....
    document.getElementById("mean").innerText = "Mean: " + mean;
    document.getElementById("mean2").innerText = "µ = " + mean;
    document.getElementById("zMean").value = mean;
    
    //Standard Deviation
    var standardDeviation = findStandardDeviation(dataset, amountOfElements, mean);
    global_SD = standardDeviation;  
    document.getElementById("sd").innerText = "Standard deviation: " + standardDeviation;
    document.getElementById("sd2").innerText = "σ = " + standardDeviation;
    document.getElementById("zStandardDev").value = standardDeviation;
    //alert(standardDeviation);

    //Z-Score setup
    
    
    
    document.getElementById("zScoreDiv").style.visibility = "visible";

    }//end function add()

    function findStandardDeviation(dataset, amountOfElements, mean){
            var sum = 0;
            var denominator = amountOfElements -1;

             // Σ(x - mean) 
            for(var element in dataset){
                var temp = dataset[element];
                temp -= mean;
                temp *= temp;
                sum += temp;
            }//end loop
             
            //divided by....
            sum = sum / denominator;
            var sd = Math.sqrt(sum); //squared into standard deviation
        return sd;
    }//end function

    function findMean(dataset, amountOfElements){
        var total = Number(0);
        for(var element in dataset){
            total += Number(dataset[element]);         
        }//end loop

        var mean = total / amountOfElements;
        return mean;
    }//end function


    function isDecimal(num) {
         if (isNaN(num)) {
            return false; // Not a number
        }
         num = parseFloat(num); // Convert to float
         if (num < 0 || num > 1) {
            return false; // Out of range
         }
         if (num === 0 || num === 1) {
            return false; // Not a decimal
         }
    return num % 1 !== 0;
    } //helper function
    function percentile(){

    if(!isDecimal(document.getElementById("percentile").value)){
        alert("Percentile must be a decimal value between 0 and 1.");
        return;
    }

    const dataset = getDataSet();
   // var amountOfElements = dataset.elements.length; //get the amount of elements in the dataset
    var amountOfElements = 0; //is incremented to get size of array
    for(var element in dataset)    
        amountOfElements++;

    var q = Number(document.getElementById("percentile").value);
        q = q * amountOfElements; //convert to percent
        q = Math.ceil(q); //round up to nearest whole number
        q = q - 1; //subtract 1 to get the index of the array
        
        percentileOutPut.innerText = "Percentile: " + dataset[q]; //dataset[q] is the value at that percentile
    }//end function percentile()

    //-------------------------- Z SCORE------------
    function findZ(){

        var x = Number(zscore.value);
        var mean = Number(zMean.value);
        var sd = Number(zStandardDev.value);
       
        alert(x);
        x = x - mean;
        alert(x);
        x = x / sd;
        document.getElementById("zscoreOutPut").innerText = "Z-Score: " + x;
       
            
            
            plotBellCurve(mean, sd);

    }

    function displayBarChart(bounds, ranges, minValue, amount_of_bounds){

        const yValues = ranges;
        var xValues = []; //
        const barColors = ["white"];
        var upperBounds = bounds; //the upper bounds
        //get ranges into x values, color too
        for(var i = 0; i < amount_of_bounds; i++){

            xValues.push(minValue + " to " + upperBounds);//${minValue} - ${bounds} 
            barColors.push("yellow");
             
            minValue = bounds * (i+1); //min value = 0 to 10, 10 to 20
            upperBounds += bounds;
        }
        
        //build the chart
        new Chart("myChart", {
            
            type: "bar",
            data: {
                labels: xValues,  //xvalues is the subject
                
                datasets: [{
                backgroundColor: barColors,
                
                data: yValues //yvalues(metrics of X)
                }]
            },
            options: {
            
                legend: {display: false},
                scales: {
                yAxes: [{
                    ticks: {
                    beginAtZero: true
                    }
                }]
                },

                title: {
                display: true,
                
                text: "Student Test Scores"
                }
            }//options
        });//end chart

    }//end function displayChart()


    //Bell Curve
    function plotBellCurve(mean, standardDeviation) {
        const xValues = [];
        const yValues = [];
        const step = 0.1;

        for (let x = mean - 4 * standardDeviation; x <= mean + 4 * standardDeviation; x += step) {
            const y = (1 / (standardDeviation * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / standardDeviation, 2));
            xValues.push(x);
            yValues.push(y);
        }
        const chartContainer = document.getElementById('bellCurveChart');
        const ctx = chartContainer.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: 'Bell Curve',
                    data: yValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Probability Density'
                        }
                    }
                }
            }
        });
    }//End of Bell Curve
    

  