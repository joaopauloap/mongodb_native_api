const loginmsg = 
`No home directory specified in password file!
Logging in with home=/
# bin/history 
488 cd/opt/LLL/controller/laser/ 
489 vi LLLSDLaserControl.c 
490 make 
491 make install 
492 ./sanity_check 
493 ./configure –o test.cfg 
494 vi test.cfg 
495 vi ~/last_will_and_testament.txt 
496 cat /proc/meminfo
497 ps -a -x -u
498 kill -9 2207
499 kill 2208
500 ps -a -x -u
501 touch/opt/LLL/run/ok
502 LLLSDLaserControl -ok 1`

const lasermsg = 
`* Starting up...
* PSU online
* HV online
* Analog core memory . . . OK!
* Booting pattern reconition systems
* Merging current data mode!
* Starting laser emmitter
* Particle traps test OK!
* Entangling laser with particle traps
>>> Confirmation Alert 
>> Aperture Clear?`

function generalcommands(comando){

    if (comando.match(/uname/i)){
        term.echo("SolarOS 4.0.1 Generic_50203-02 sun4m i386");
    }else if (comando.match(/vi/i)){
        term.echo("Vi not installed");
    }else if(comando == "help"){
        term.echo("MCP: No help for you, User.");
        term.echo("END OF LINE");
    }else if(comando =="whoami"){
        term.echo("flynn");
    }else{
        term.echo("Unknown command " + comando);
    }       
}













var term;

jQuery(function($) {

    $( "#dialog-confirm" ).dialog({
      autoOpen: false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "< Yes >": function() {
            $.post("/auth", {username:"user",password:"123"})
            .done(function(data){
                window.location.reload();
            });
        },
        "< No >": function() {
          term.echo(">Aperture Halted.");
          $(this).dialog("close");
      }
  }
});
    

        term = $('body').terminal(function(command, term) { //1° Level

         if ((command.match(/login/i))&&(command.match(/backdoor/i))){

            term.echo(loginmsg);

            term.push(function(command, term) {     //2° Level

                if (command.match(/login/i)){
                    term.echo("Already logged in");
                }else if (command.match(/lllsdlasercontrol/i)) {

                    term.echo(lasermsg); 
                    $("#dialog-confirm").dialog("open");


                } else {
                    generalcommands(command);
                        //term.echo('unknown command ' + command);
                    }
                }, {
                    prompt: '#> ',
                    name: '#'
                });
        }else {

            if (command.match(/login/i)){
               term.echo(`Login incorrect. User${command.replace("login","")} not found!`);
           }else{

            generalcommands(command);
                //term.echo('unknown command ' + command);

            }
        }
        
    }, {
        greetings: "SolarOS 4.0.1 Generic_50203-02 sun4m i386\nPlease, login.",
        onBlur: function() {
            // prevent loosing focus
            return false;
        }
    });
    });
