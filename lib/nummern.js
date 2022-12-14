"use strict";

////////////////////////////////
//----------------------------//
// Copyright (c) 2017 NullDev //
//----------------------------//
////////////////////////////////

const en = {
    ones:  ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
    tens:  ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
    b10:   ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
    b1000: ["", "thousand", "million", "billion", "trillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"],
    misc:  ["zero", "hundred", "point", "minus"]
};

const de = {
    ones:  ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"],
    tens:  ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achzig", "neunzig"],
    b10:   ["zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "sibzehn", "achzehn", "neunzehn"],
    b1000: ["", "tausend", "millionen", "milliarden", "billionen", "billiarde", "trillionen", "trilliarde", "quadrillionen", "quadrilliarde", "quintillionen"],
    misc:  ["null", "hundert", "komma", "minus"],
    other: ["eins", "eine", "und"]
};

const bs = {
    ones:  ["", "jedan", "dva", "tri", "četiri", "pet", "šest", "sedam", "osam", "devet"],
    tens:  [],
    b10:   ["deset"],
    b1000: ["", "hiljadu", "miliona", "milijardu", "bilion", "bilijar", "trilion", "trilliarde", "quadrillion", "quadrilliard", "quintillion"],
    misc:  ["nula", "sto", "zares", "minus"],
    other: ["aest"]
};

var isset = function(obj){ return !!(obj && obj !== null && (typeof obj === 'string' && obj !== "")); };

var isInt = function(num){ return num % 1 === 0; };

var parse  = function(num)   { return (Math.ceil(num.toString().length / 3) - 1); };
var _pow   = function(num, g){ return Math.pow(10 ,(g * 3)); };
var _seg   = function(num, g){ return (num % (_pow(num, g + 1))); };
var group  = function(num, g){ return Math.floor(_seg(num, g) / _pow(num, g)); };
var numprs = function(num, g){ return (group(num, g) % 100); };

var validate = function(num){
    if (isNaN(num) || typeof num !== "number"){
        console.log("Error: " + num + " is not a number.");
        return false;
    }
    else if (num > Number.MAX_SAFE_INTEGER){
        console.log("Error: " + num + " must not be larger than " + Number.MAX_SAFE_INTEGER);
        return false;
    }
    else if (num < Number.MIN_SAFE_INTEGER){
        console.log("Error: " + num + " must not be smaller than " + Number.MIN_SAFE_INTEGER);
        return false;
    }
    else return true;
};

function enText(num){
    var isMinus = false;

    var b100 = function(num){ return ((num < 100) || (num > 1000) ? "" : (en.ones[Math.floor(num / 100)] + " " + en.misc[1] + " ")); };

    var ten = function(num){
        if (num === 0) return "";
        else if ((num < 10) && (num >= 0)) return (en.ones[num] + " ");
        else if ((num < 20) && (num >= 10)) return (en.b10[num - 10] + " ");   
        else {
            if (en.ones[num % 10]) return (en.tens[Math.floor(num / 10)] + "-" + en.ones[num % 10] + " ");   
            else return (en.tens[Math.floor(num / 10)] + " ");
        }
    };

    var operateFloat = function(num, isMinus){
        var prefloat  = num.toString().split(".")[0];
        var postfloat = num.toString().split(".")[1];
        var str = enText(prefloat) + " " + en.misc[2] + " ";;
        var digits = ("" + postfloat).split("");
        for (var i = 0; i < digits.length; i++) str += (en.ones[digits[i]] == "" ? en.misc[0] : en.ones[digits[i]]) + " ";
        if (isMinus) str = en.misc[3] + " " + str;
        return str;
    };

    if (num.toString().indexOf("-") === 0){
        isMinus = true;
        num *= -1;
    }

    var str = "";
    if (num === 0) str = en.misc[0];
    else if (!isInt(num)) return operateFloat(num, isMinus); 
    else {   
        var i = parse(num);            
        for (i; i >= 0; i--){
            str += b100(group(num, i));
            str += ten(numprs(num, i));
            if (group(num, i) > 0) str += en.b1000[i] + " ";
        }   
    }
    str = str.trim();
    if (isMinus) str = en.misc[3] + " " + str;
    return str;
}

function bsText(num){
    var isMinus = false;

    var b100 = function(num){ 
        var i = Math.floor(num / 100);
        return ((num < 100) || (num > 1000) ? "" : ((i == 1 ? "" : bs.ones[i]) + " " + bs.misc[1] + " ")); 
    };

    var ten = function(num){
        if (num === 0) return "";
        else if ((num < 10) && (num >= 0)) return (bs.ones[num] + " ");
        else if ((num < 20) && (num >= 10)) return ((bs.ones[num % 10] == bs.ones[2] ? bs.ones[2] + "n" : bs.ones[num % 10]) + bs.other[0]);   
        else {
            if (bs.ones[num % 10]) return (bs.ones[(num % 10) - 1] + bs.b10[0] + " " + bs.ones[num % 10] + " ");   
            else return (bs.ones[(num % 10) + parseInt(num.toString().substring(0,1))] + bs.b10[0] + " ");
        } 
    };

    var operateFloat = function(num, isMinus){
        var prefloat  = num.toString().split(".")[0];
        var postfloat = num.toString().split(".")[1];
        var str = bsText(prefloat) + " " + bs.misc[2] + " ";;
        var digits = ("" + postfloat).split("");
        for (var i = 0; i < digits.length; i++) str += (bs.ones[digits[i]] == "" ? bs.misc[0] : bs.ones[digits[i]]) + " ";
        if (isMinus) str = bs.misc[3] + " " + str;
        return str;
    };

    if (num.toString().indexOf("-") === 0){
        isMinus = true;
        num *= -1;
    }

    var str = "";
    if (num === 0) str = bs.misc[0];
    else if (!isInt(num)) return operateFloat(num, isMinus); 
    else {   
        var i = parse(num);            
        for (i; i >= 0; i--){
            str += b100(group(num, i));
            str += ten(numprs(num, i));
            if (group(num, i) > 0) str += bs.b1000[i] + " ";
        }   
    }
    str = str.trim();
    if (isMinus) str = bs.misc[3] + " " + str;
    return str;
}

function deText(num){
    var isMinus = false;

    var b100 = function(num){ return ((num < 100) || (num > 1000) ? "" : (de.ones[Math.floor(num / 100)] + " " + de.misc[1] + " ")); };

    var ten = function(num){
        if (num === 0) return "";
        else if ((num < 10) && (num >= 0))  return (de.ones[num] + " ");
        else if ((num < 20) && (num >= 10)) return (de.b10[num - 10] + " ");   
        else {
            if (de.ones[num % 10]) return (de.ones[num % 10] + de.other[2] + de.tens[Math.floor(num / 10)] + " ");   
            else return (de.tens[Math.floor(num / 10)] + " ");
        }
    };

    var operateFloat = function(num, isMinus){
        var prefloat  = num.toString().split(".")[0];
        var postfloat = num.toString().split(".")[1];
        var t = deText(prefloat);
        var str = (t === de.ones[1] ? de.other[0] : t) + " " + de.misc[2] + " ";
        var digits = ("" + postfloat).split("");
        for (var i = 0; i < digits.length; i++) str += (de.ones[digits[i]] == "" ? de.misc[0] : de.ones[digits[i]]) + " ";
        if (isMinus) str = de.misc[3] + " " + str;
        return str;
    };

    if (num.toString().indexOf("-") === 0){
        isMinus = true;
        num *= -1;
    }
    var str = "";
    if (num === 0) str = de.misc[0];
    else if (num === 1) str = de.other[0];
    else if (!isInt(num)) return operateFloat(num, isMinus);
    else {   
        var i = parse(num);  
        if (num > 999999) str += de.other[1] + " ";       
        for (i; i >= 0; i--){
            str += b100(group(num, i));
            str += (num > 999999) ? "" : ten(numprs(num, i));
            if (group(num, i) > 0) str += de.b1000[i] + " ";
        } 
    }
    str = str.trim();
    if (isMinus) str = de.misc[3] + " " + str;
    return str;
}

var nummern = function(num, lang){
    if (!validate(num)) return false;
    lang = (isset(lang) ? lang : "english");
    switch(lang.toString().toLowerCase()){
        case "german":  { return deText(num); }
        case "bosnian": { return bsText(num); } 
        default:        { return enText(num); }
    }
};

module.exports = nummern;
