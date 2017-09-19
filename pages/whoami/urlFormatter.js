var file = document.getElementById("myFile");
// takes input from somewhere 
// for now it's from a document
console.log("urlFormatter.js Loaded");
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

//function main() {
    function test() { 
        var urlList = document.getElementById('fileItem').files[0];
        console.log(urlList);
       
    }
//}
//console.log(FileReader.Result('test.txt'));

//////////////////////////////////////////////////////////////////////////
function refresh() {
	var urlList = "test"
}