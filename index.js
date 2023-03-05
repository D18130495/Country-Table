function loadTable() {
    // display or hide country table
    $("#countryTableContainer").toggle()

    // check if the table is currently displayed
    if($("#countryTableContainer").is(':visible')) {
        // display or hide row button, table, table place holder and change button text
        $("#countryButton").addClass("visually-hidden")
        $("#countryTableContainer").addClass("visually-hidden")
        $("#tableHolder").removeClass("visually-hidden")
        $("#countryButton").text("Hide Table")

        // start timer
        start()

        // $.getJSON is the short version for $.ajax get request
        // read country capital city JSON
        capital = $.getJSON("./country-objects/country-by-capital-city.json", "", function(capital) {
            alert('Capital City has been read', 'success')
        });

        // read country continent JSON
        continent = $.getJSON("./country-objects/country-by-continent.json", "", function(continent) {
            alert('Continent has been read', 'success')
        });

        // read costline JSON
        costline = $.getJSON("./country-objects/country-by-costline.json", "", function(costline) {
            alert('Costline has been read', 'success')
        });

        // read currency name JSON
        currency = $.getJSON("./country-objects/country-by-currency-name.json", "", function(currency) {
            alert('Currency Name has been read', 'success')
        });

        // read domain tld JSON
        domain = $.getJSON("./country-objects/country-by-domain-tld.json", "", function(domain) {
            alert('Domain tld has been read', 'success')
        });

        // read flag JSON
        flag = $.getJSON("./country-objects/country-by-flag.json", "", function(flag) {
            alert('Flag has been read', 'success')
        });
        
        // wait for ajax request
        $.when(capital && continent && costline && currency && domain && flag).done(function() {
            // merge JSON data
            firstMerge = mergeJSON(capital.responseJSON, continent.responseJSON, "country")
            secondMerge = mergeJSON(firstMerge, costline.responseJSON, "country")
            thirdMerge = mergeJSON(secondMerge, currency.responseJSON, "country")
            forthMerge = mergeJSON(thirdMerge, domain.responseJSON, "country")
            finalMerge = mergeJSON(forthMerge, flag.responseJSON, "country")
           
            // create table
            createTable(finalMerge, 20)

            setTimeout(() => {
                // display or hide row button, table, table place holder and change button text
                $('#liveAlertPlaceholder').empty()
                $("#countryButton").removeClass("visually-hidden")
                $("#countryTableContainer").removeClass("visually-hidden")
                $("#tableHolder").addClass("visually-hidden")

                stop() // stop timer

                // alert message for how much time table has been created
                alert('The table has been created and has taken ' + hour + ' hour ' + minute + ' minute ' + second + ' second ' + millisecond + ' millisecond', 'success')
                
                // reset timer
                reset()
                hour = minute = second = millisecond = 0
            }, 3000)
        })
    }else {
        // change button text and empty the notification
        $("#countryButton").text("Load Table")
        $('#liveAlertPlaceholder').empty()
        $('#mainTable').empty()
    }
}

// --------------  alert element and style  ----------------
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
    const wrapper = document.createElement('div')
    
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" style="margin:0 auto; margin-bottom: 25px; width: 65%;" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}

// -----------------  initial ----------------------
// initial hide table
$(document).ready(function() {
    $("#countryTableContainer").hide()
});

//  ----------------  timer  -----------------------
var hour = minute = second = millisecond = 0
var int

function start() {
    int = setInterval(timer, 50)
}

function stop() {
    window.clearInterval(int)
}

function reset() {
    window.clearInterval(int)
    hour = minute = second = millisecond = 0
}

function timer() {
    millisecond = millisecond + 50
    
    if(millisecond >= 1000)
    {
        millisecond = 0
        second = second + 1
    }
    if(second >= 60)
    {
        second = 0
        minute = minute + 1
    }

    if(minute >= 60)
    {
        minute = 0
        hour = hour + 1
    }
}

//  ----------------  create table  ----------------------------
function createTable(json, row) {
   $.each(json, function(index, item) {
    if(index < row) {
        const count = $("<td></td>").append(index + 1)
        const country = $("<td></td>").append(item.country !== null && item.country !== undefined? item.country:"NA")
        const capital = $("<td></td>").append(item.city !== null && item.city !== undefined? item.city:"NA")
        const continent = $("<td></td>").append(item.continent !== null && item.continent !== undefined? item.continent:"NA")
        const costline = $("<td></td>").append(item.costline !== null && item.costline !== undefined? item.costline:"NA")
        const currency = $("<td></td>").append(item.currency_name !== null && item.currency_name !== undefined? item.currency_name:"NA")
        const domain = $("<td></td>").append(item.tld !== null && item.tld !== undefined? item.tld:"NA")
        const flag = $("<td></td>").append(item.flag_base64 !== null && item.flag_base64 !== undefined? '<img src=' + item.flag_base64 + ' style=\'width: 3em\'>':"NA")

        $("<tr id=" + "tr" + index + " style=\'vertical-align: middle\'></tr>").append(count).append(country).append(capital).append(continent)
            .append(costline).append(currency).append(domain).append(flag)
            .appendTo("#mainTable")
        }
   })

   // mouse hover change table color
   $("#mainTable td").mouseover(function() {
        if($(this).css('background-color') !== "rgb(193, 222, 247)") { // check if the cell selected, not add hover
            $(this).css("background-color", "#f0f8ff")
        }
    }).mouseout(function () { // mouse out
        if($(this).css('background-color') !== "rgb(193, 222, 247)") { // check if the cell selected, not remove colour
            $(this).removeAttr("style", "")
        }
    });

    // mouse click select function
    $("#mainTable td").click(function() {
        if($(this).css('background-color') === "rgb(193, 222, 247)") { // already selected, remove select colour
            $(this).removeAttr("style", "")
            $(this).removeClass('selectedCell')
        }else { // not selected
            $("#mainTable td").removeAttr("style", "") // remove other colour
            $(this).css("background-color", "#c1def7") // add slect colour
            $("#mainTable td").removeClass('selectedCell')
            $(this).addClass('selectedCell')
        }
    })

    // click outside the table and drag button
    $("body").click(function(e) {
        var event = e || window.event
        var target = event.target || event.srcElement
        
        // check if outside the table or drag button
        if(!document.getElementById("mainTable").contains(target) && !document.getElementById("draggable").contains(target)) {
            $("#mainTable td").removeAttr("style", "")
            $("#mainTable td").removeClass('selectedCell')
        }
    })
}

// ---------------------  change the row of the table  --------------------------
function recreateTable(obj) {
    if(obj.selectedIndex === 0) {
        $('#mainTable').empty()
        createTable(finalMerge, 20) // create table, length is 20
    }else {
        $('#mainTable').empty()
        createTable(finalMerge, finalMerge.length) // create the dull table
    }
}

//  ---------------------  merge JSON  --------------------------
function mergeJSON(a, b, key) {
    function x(a) {
        a.forEach(function(b) { // each item in first JSON
            if(!(b[key] in obj)) { // check if the key in second JSON 
                obj[b[key]] = obj[b[key]] || {} // if have value push this value else push {}
                array.push(obj[b[key]]) // push all the key in both JSON
            }

            Object.keys(b).forEach(function(k) { // each value in the sub JSON object
                obj[b[key]][k] = b[k]
            })
        })
    }

    var array = [], obj = {}

    x(a)
    x(b)

    return array
}

// ---------------------  jQuery Effect ------------------------------
// scale purpose
function scalePurpose() {
    // change button text
    if($("#effectButton1").text() === "Hide Purpose") {
        $("#effectButton1").text("Show Purpose")
    }else {
        $("#effectButton1").text("Hide Purpose")
    }
    
    $("#purpose").toggle("scale", {percent: 50}, 800); // scale
}

// narrow and widen technologies
function animateTechnologiesNarrow() {
    minWidth = $("body").width() * 0.4 // min wide
    
    if($("#technologies").width() > minWidth) { // can not zoom out
        $("#technologies").animate({
            width: "-=8%"
        }, 500)
    }
}

function animateTechnologiesWiden() {
    maxWidth = $("body").width() * 0.9 // max wide

    if($("#technologies").width() < maxWidth) { // can not zoom in
        $("#technologies").animate({
            width: "+=8%"
        }, 500)
    }
}

// change theme colour
function changeThemeColour() {
    colour = randomColor() // get random colour

    $("#header").css("background-color", colour) // set header colour
    $("#footer").css("background-color", colour) // set footer colour
    $("#effectButton5").removeClass("visually-hidden") // display reset button
}

// reset theme colour
function resetThemeColour() {
    $("#header").css("background-color", "#333333") // set header to black
    $("#footer").css("background-color", "#333333") // set footer to black
    $("#effectButton5").addClass("visually-hidden") // hide reset button
}

// get random colour
function randomColor() {
	var color = ""

	for(var i = 0; i < 6; i++) {
		color += (Math.random() * 16 | 0).toString(16)
	}

	return "#" + color
}

// drag button
$("#draggable").draggable()


// cell bounce
function bounce() {
    $(".selectedCell").animate({ fontSize: '+=3px' }, 500) // font zoom in
    $(".selectedCell").css('color', randomColor()) // change font colour
    $(".selectedCell").css('font-weight', "600") // change font size
    $(".selectedCell").animate({ fontSize: '-=3px' }, 300) // font zoom out
}

// change image gray
function changeGray() {
    $('.carousel-item').each(function() { // find all carousel item
        if($(this).hasClass("active")) { // find active item
            if($(this).find("img").hasClass("grayscale")) { // find if the image current gray
                $(this).find("img").removeClass("grayscale") // remove gray
                $('#effectButton6').text("Gray Image") // change text
                $('#button6Info').text("Change Image Gray") // change text
            }else {
                $(this).find("img").addClass("grayscale") // add gray
                $('#effectButton6').text("Colour Image") // change text
                $('#button6Info').text("Try Hover on the Image!") // change text
            }
        }
    })
}

// reset all carousel items
function reset() {
    $('.carousel-item').find("img").removeClass("grayscale")
    $('#effectButton6').text("Gray Image")
    $('#button6Info').text("Change Image Gray")

    $("#imageContainer").animate({ width: '50%' }, 800)
    $(".carousel-item").find("div").css("opacity", "0")
    $('#effectButton7').text("Show More")
}

// zoom and display information
function showMore() {
    $('.carousel-item').each(function() { // find all carousel item
        if($(this).hasClass("active")) { // find active item
            if($(this).find("img").hasClass("showmore")) { // find if the image current gray
                $("#imageContainer").animate({ width: '50%' }, 800) // small
                $(this).find("img").removeClass("showmore") // remove active
                
                $(this).find("div").css("opacity", "0") // hide text

                $('#effectButton7').text("Show More") // change text
            }else {
                $("#imageContainer").animate({ width: '55%' }, 800) // big
                $(this).find("img").addClass("showmore") // add active
                
                $(this).find("div").css("opacity", "1") // shiow text
                
                $('#effectButton7').text("Show Less") // change text
            }
        }
    })
}