
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function get_player_object(file_name){
	var audio = document.createElement('audio');
	audio.src = file_name
	
	audio.load()
	return audio
}
