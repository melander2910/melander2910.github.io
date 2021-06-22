// function for creating drum-machine input checkboxes
function createDrumMachine(rowId) {
    for (let i = 0; i < 16; i++) {
        let input = document.createElement("INPUT");
        input.setAttribute("type", "checkbox");
        input.setAttribute("style", "margin-right: 14px;");
        input.classList.add("shadow");
        document.getElementById(rowId).appendChild(input)
    }
}

// creating the indicator row
function createIndicatorRow(rowId) {
    for (let i = 0; i < 16; i++) {
        let input = document.createElement("INPUT");
        input.setAttribute("type", "checkbox");
        input.setAttribute("style", "margin-right: 14px;");
        input.classList.add("shadow");
        input.classList.add("indicator");
        document.getElementById(rowId).appendChild(input)
    }
}

// calling function for creating input checkboxes
createIndicatorRow("indicator")
createDrumMachine("top")
createDrumMachine("middle-1")
createDrumMachine("middle-2")
createDrumMachine("middle-3")
createDrumMachine("bottom")

// adding drum sounds - to be used in drum-machine
let hihat = new Tone.Player("./samples/CYCdh_K1close_ClHat-01.wav").toDestination();
let snare = new Tone.Player("./samples/CYCdh_K1close_Snr-01.wav").toDestination();
let rim = new Tone.Player("./samples/CYCdh_K1close_Rim-01.wav").toDestination();
let sdst = new Tone.Player("./samples/CYCdh_K1close_SdSt-01.wav").toDestination();
let kick = new Tone.Player("./samples/CYCdh_K1close_Kick-03.wav").toDestination();


// constants for recording
const context = Tone.context;
const dest = context.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);

//const recorder = new Tone.Recorder();

// passing recorded audio into these audio tags
const audio1 = document.getElementById("audio1")
const audio2 = document.getElementById("audio2")
const audio3 = document.getElementById("audio3")

// standard volume of audio tags too high compared to midi piano
audio1.volume = 0.2;
audio2.volume = 0.2;
audio3.volume = 0.2;

// creating an array to store recorded data
const chunks1 = [];
const chunks2 = [];
const chunks3 = [];

// booleans to keep track of which recording is started
let makeRecording = false;
let makeRecording2 = false;
let makeRecording3 = false
let started1 = false;
let started2 = false;
let started3 = false;


// start recording on click event
document.getElementById("startRecording1").addEventListener("click", () => {
    makeRecording = true;
})

document.getElementById("startRecording2").addEventListener("click", () => {
    makeRecording2 = true;
})

document.getElementById("startRecording3").addEventListener("click", () => {
    makeRecording3 = true;
})



function sequencer() {
    let checkbox = 0;

    // initials beats per minute
    Tone.Transport.bpm.value = 80;

    // lowering all volume to stop crackling
    Tone.Master.volume.value = -10;

    // repeated event every 16th note
    Tone.Transport.scheduleRepeat(repeat, "16n")

    Tone.Transport.start();

    // Will be called for each of my 16 checkboxes to check if a sound should be played. 
    // This function also check if a recording has been requested. 
    // The recording will start when looptime hits 0 and end when looptime hits 31
    function repeat(time) {

        // step is used to check every input checkbox 
        let step = checkbox % 16;

        // looptime is used for recording sound.
        let looptime = checkbox % 32;

        let selectedSound1 = document.querySelector(`.top input:nth-child(${step + 1})`);
        let selectedSound2 = document.querySelector(`.middle-1 input:nth-child(${step + 1})`);
        let selectedSound3 = document.querySelector(`.middle-2 input:nth-child(${step + 1})`);
        let selectedSound4 = document.querySelector(`.middle-3 input:nth-child(${step + 1})`);
        let selectedSound5 = document.querySelector(`.bottom input:nth-child(${step + 1})`);

        let indicatorStep = document.querySelector(`#indicator input:nth-child(${step + 1})`);
        let indicators = document.getElementsByClassName("indicator");
        
        for (let i = 0; i < indicators.length; i++) {
            indicators[i].checked = false
        }

        indicatorStep.click();
        
        // looptime 
        console.log("looptime: " + looptime);

        // will play a drum sound for each checked box
        if (selectedSound1.checked) {
            hihat.start(time).stop(time + 0.1);
        }
        if (selectedSound2.checked) {
            snare.start(time).stop(time + 0.1);
        }
        if (selectedSound3.checked) {
            rim.start(time).stop(time + 0.1);
        }
        if (selectedSound4.checked) {
            sdst.start(time).stop(time + 0.1);
        }
        if (selectedSound5.checked) {
            kick.start(time).stop(time + 0.1);
        }

        
        // recording and looping piano
        // first recorder
        if (makeRecording) {
            let recordBtn = document.getElementById("startRecording1");
            if(!started1){
                recordBtn.setAttribute("style", "background-color: orange;");
                recordBtn.innerText = "Waiting for step.."; 
            }
            if (looptime == 0 && !started1) {
                recordBtn.setAttribute("style", "background-color: red;");
                recordBtn.innerText = "Recording..";
                started1 = true
                // connecting sampler to the media stream. Sampler = midi piano
                sampler.connect(dest);
                sampler.toMaster();
                recorder.start();
                console.log("Now recording");
            }
            else if (looptime == 31 && started1) {
                recordBtn.setAttribute("style", "background-color: green;");
                recordBtn.innerText = "Playing..";
                makeRecording = false;
                started1 = false;
                console.log("No longer recording");
                recorder.stop();
                // ondataavailable returns blobs of multimedia data. the array chunks1 holds all the blobs 
                recorder.ondataavailable = event => chunks1.push(event.data);
                recorder.onstop = evt => {
                    // creating a new blob using all the small blobs in order to create one long audio src
                    let blob = new Blob(chunks1);
                    audio1.src = URL.createObjectURL(blob);
                }
            }
        }

        // second recorder
        if (makeRecording2) {
            let recordBtn = document.getElementById("startRecording2");
            if(!started2){
                recordBtn.setAttribute("style", "background-color: orange;");
                recordBtn.innerText = "Waiting for step.."; 
            }
            if (looptime == 0 && !started2) {
                recordBtn.setAttribute("style", "background-color: red;");
                recordBtn.innerText = "Recording..";
                started2 = true
                sampler.connect(dest);
                sampler.toMaster();
                recorder.start();
                console.log("Now recording");
            }
            else if (looptime == 31 && started2) {
                recordBtn.setAttribute("style", "background-color: green;");
                recordBtn.innerText = "Playing..";
                makeRecording2 = false;
                started2 = false;
                console.log("No longer recording");
                recorder.stop();
                recorder.ondataavailable = evt => chunks2.push(evt.data);
                recorder.onstop = evt => {
                    let blob = new Blob(chunks2, {
                        type: 'audio/ogg; codecs=opus'
                    });
                    audio2.src = URL.createObjectURL(blob);  
                }
            }
        }

        // second recorder
        if (makeRecording3) {            
            let recordBtn = document.getElementById("startRecording3");
            if(!started3){
                recordBtn.setAttribute("style", "background-color: orange;");
                recordBtn.innerText = "Waiting for step.."; 
            }
            if (looptime == 0 && !started3) {
                recordBtn.setAttribute("style", "background-color: red;");
                recordBtn.innerText = "Recording..";
                started3 = true
                sampler.connect(dest);
                sampler.toMaster();
                recorder.start();
                console.log("Now recording");
            }
            else if (looptime == 31 && started3) {
                recordBtn.setAttribute("style", "background-color: green;");
                recordBtn.innerText = "Playing..";
                makeRecording3 = false;
                started3 = false;
                console.log("No longer recording");
                recorder.stop();
                recorder.ondataavailable = evt => chunks3.push(evt.data);
                recorder.onstop = evt => {
                    let blob = new Blob(chunks3, {
                        type: 'audio/ogg; codecs=opus'
                    });
                    audio3.src = URL.createObjectURL(blob);  
                }
            }
        }
        checkbox++
    }
}

sequencer();


// -- start/stop drum machine start --
let on = false;
document.getElementById("play").addEventListener("click", () => {
    if (!on) {
        Tone.Transport.start()
        Tone.start();
        on = true;
    } else {
        Tone.Transport.start().stop();
        on = false;
    }
})
// -- start/stop drum machine end --

// Most browsers support web midi access
if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');
} else {
    console.log('WebMIDI is not supported in this browser.');
}

// requesting midi access - calling onMIDISuccess on resolve and onMIDIFailure on reject
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);


function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

function onMIDISuccess(midiAccess) {
    for (let input of midiAccess.inputs.values())
        input.onmidimessage = getMIDIMessage;
}

function getMIDIMessage(message) {
    let command = message.data[0];
    let noteNumber = message.data[1];
    // if else || - if message length > 2, velocity = data[2] else 0
    let velocity = (message.data.length > 2) ? message.data[2] : 0;
    console.log(command, noteNumber, velocity);
    playMidi(noteNumber, command, sampler, sustain);
}

// Tone sampler laver et instrument ud fra disse samples
let sampler = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
    },
    release: 1,
    baseUrl: "/pianoNotes/",
}).toDestination();



// -- Sustain slider start --
let slider = document.getElementById("sustainpedal");
let output = document.getElementById("sustainlength");
let sustain = slider.value
output.innerHTML = slider.value;

slider.oninput = () => {
    sustain = slider.value
    output.innerHTML = sustain;
}
// -- Sustain slider end --

// -- BPM slider start --
let bpm = document.getElementById("bpm");
let bpmOutput = document.getElementById("bpmValue");
let bpmValue = bpm.value
bpmOutput.innerHTML = bpm.value;

bpm.oninput = () => {
    bpmValue = bpm.value
    bpmOutput.innerHTML = bpmValue;
    Tone.Transport.bpm.value = bpmValue;
}
// -- BPM slider end --

// let bpmClock = 1;
// let clock = new Tone.Clock(time => {
//     console.log(time);
// }, bpmClock)
// clock.start();

function piano() {
    // Clicking the piano to play
    const notes = document.querySelectorAll('.note')
    let mousedown = false;
    notes.forEach(note => {
        note.addEventListener("mousedown", () => {
            play(note, sampler, sustain)
            mousedown = true;
        })
        note.addEventListener("mouseenter", () => {
            if (mousedown) {
                play(note, sampler, sustain)
            }
        })
        note.addEventListener("mouseup", () => {
            mousedown = false;
        })
    })
}


function play(note, sampler, sustain) {
    sampler.triggerAttackRelease(note.id, sustain, Tone.context.currentTime);
    note.classList.add("active");
    setTimeout(() => {
        note.classList.remove("active");
    }, 100)
}

piano();

function playMidi(noteNumber, command, sampler, sustain) {
    let id = document.getElementsByName(noteNumber)[0].getAttribute("id");
    if (command == 144) {
        document.getElementById(id).classList.add("active");
        sampler.triggerAttackRelease(id, sustain, Tone.context.currentTime)
        console.log(sustain);
    }
    if (command == 128) {
        document.getElementById(id).classList.remove("active");
    }
}

document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.repeat) return
    if (event.key == "q") {
        sampler.triggerAttackRelease(["C3"], sustain, Tone.context.currentTime);
        document.getElementById("C3").classList.add("active");
        setTimeout(() => {
            document.getElementById("C3").classList.remove("active");
        }, 200)
    }
    if (event.key == "2") {
        sampler.triggerAttackRelease(["C#3"], sustain, Tone.context.currentTime);
        document.getElementById("C#3").classList.add("active");
        setTimeout(() => {
            document.getElementById("C#3").classList.remove("active");
        }, 200)
    }
    if (event.key == "w") {
        sampler.triggerAttackRelease(["D3"], sustain, Tone.context.currentTime);
        document.getElementById("D3").classList.add("active");
        setTimeout(() => {
            document.getElementById("D3").classList.remove("active");
        }, 200)
    }
    if (event.key == "3") {
        sampler.triggerAttackRelease(["D#3"], sustain, Tone.context.currentTime);
        document.getElementById("D#3").classList.add("active");
        setTimeout(() => {
            document.getElementById("D#3").classList.remove("active");
        }, 200)
    }
    if (event.key == "e") {
        sampler.triggerAttackRelease(["E3"], sustain, Tone.context.currentTime);
        document.getElementById("E3").classList.add("active");
        setTimeout(() => {
            document.getElementById("E3").classList.remove("active");
        }, 200)
    }
    if (event.key == "4") {
        sampler.triggerAttackRelease(["F3"], sustain, Tone.context.currentTime);
        document.getElementById("F3").classList.add("active");
        setTimeout(() => {
            document.getElementById("F3").classList.remove("active");
        }, 200)
    }
    if (event.key == "r") {
        sampler.triggerAttackRelease(["F#3"], sustain, Tone.context.currentTime);
        document.getElementById("F#3").classList.add("active");
        setTimeout(() => {
            document.getElementById("F#3").classList.remove("active");
        }, 200)
    }
    if (event.key == "5") {
        sampler.triggerAttackRelease(["G3"], sustain, Tone.context.currentTime);
        document.getElementById("G3").classList.add("active");
        setTimeout(() => {
            document.getElementById("G3").classList.remove("active");
        }, 200)
    }
    if (event.key == "t") {
        sampler.triggerAttackRelease(["G#3"], sustain, Tone.context.currentTime);
        document.getElementById("G#3").classList.add("active");
        setTimeout(() => {
            document.getElementById("G#3").classList.remove("active");
        }, 200)
    }
    if (event.key == "6") {
        sampler.triggerAttackRelease(["A3"], sustain, Tone.context.currentTime);
        document.getElementById("A3").classList.add("active");
        setTimeout(() => {
            document.getElementById("A3").classList.remove("active");
        }, 200)
    }
    if (event.key == "y") {
        sampler.triggerAttackRelease(["A#3"], sustain, Tone.context.currentTime);
        document.getElementById("A#3").classList.add("active");
        setTimeout(() => {
            document.getElementById("A#3").classList.remove("active");
        }, 200)
    }
    if (event.key == "7") {
        sampler.triggerAttackRelease(["B3"], sustain, Tone.context.currentTime);
        document.getElementById("B3").classList.add("active");
        setTimeout(() => {
            document.getElementById("B3").classList.remove("active");
        }, 200)
    }
    if (event.key == "u") {
        sampler.triggerAttackRelease(["C4"], sustain, Tone.context.currentTime);
        document.getElementById("C4").classList.add("active");
        setTimeout(() => {
            document.getElementById("C4").classList.remove("active");
        }, 200)
    }
    if (event.key == "8") {
        sampler.triggerAttackRelease(["C#4"], sustain, Tone.context.currentTime);
        document.getElementById("C#4").classList.add("active");
        setTimeout(() => {
            document.getElementById("C#4").classList.remove("active");
        }, 200)
    }
    if (event.key == "i") {
        sampler.triggerAttackRelease(["D4"], sustain, Tone.context.currentTime);
        document.getElementById("D4").classList.add("active");
        setTimeout(() => {
            document.getElementById("D4").classList.remove("active");
        }, 200)
    }
    if (event.key == "9") {
        sampler.triggerAttackRelease(["D#4"], sustain, Tone.context.currentTime);
        document.getElementById("D#4").classList.add("active");
        setTimeout(() => {
            document.getElementById("D#4").classList.remove("active");
        }, 200)
    }
    if (event.key == "o") {
        sampler.triggerAttackRelease(["E4"], sustain, Tone.context.currentTime);
        document.getElementById("E4").classList.add("active");
        setTimeout(() => {
            document.getElementById("E4").classList.remove("active");
        }, 200)
    }
    if (event.key == "0") {
        sampler.triggerAttackRelease(["F4"], sustain, Tone.context.currentTime);
        document.getElementById("F4").classList.add("active");
        setTimeout(() => {
            document.getElementById("F4").classList.remove("active");
        }, 200)
    }
    if (event.key == "p") {
        sampler.triggerAttackRelease(["F#4"], sustain, Tone.context.currentTime);
        document.getElementById("F#4").classList.add("active");
        setTimeout(() => {
            document.getElementById("F#4").classList.remove("active");
        }, 200)
    }
    if (event.key == "z") {
        sampler.triggerAttackRelease(["G4"], sustain, Tone.context.currentTime);
        document.getElementById("G4").classList.add("active");
        setTimeout(() => {
            document.getElementById("G4").classList.remove("active");
        }, 200)
    }
    if (event.key == "s") {
        sampler.triggerAttackRelease(["G#4"], sustain, Tone.context.currentTime);
        document.getElementById("G#4").classList.add("active");
        setTimeout(() => {
            document.getElementById("G#4").classList.remove("active");
        }, 200)
    }
    if (event.key == "x") {
        sampler.triggerAttackRelease(["A4"], sustain, Tone.context.currentTime);
        document.getElementById("A4").classList.add("active");
        setTimeout(() => {
            document.getElementById("A4").classList.remove("active");
        }, 200)
    }
    if (event.key == "d") {
        sampler.triggerAttackRelease(["A#4"], sustain, Tone.context.currentTime);
        document.getElementById("A#4").classList.add("active");
        setTimeout(() => {
            document.getElementById("A#4").classList.remove("active");
        }, 200)
    }
    if (event.key == "c") {
        sampler.triggerAttackRelease(["B4"], sustain, Tone.context.currentTime);
        document.getElementById("B4").classList.add("active");
        setTimeout(() => {
            document.getElementById("B4").classList.remove("active");
        }, 200)
    }
})




// -- change sound to bass start --
document.getElementById("bassSound").addEventListener("click", () => {
    sampler = new Tone.Sampler({
        urls: {
            "A#4": "As4.mp3",
            "C#4": "Cs4.mp3",
            "E4": "E4.mp3",
            "G4": "G4.mp3",
        },
        release: 1,
        baseUrl: "/bassNotes/",
    }).toDestination();
})
// -- change sound to bass end --

// -- change sound to acoustic guitar start --
document.getElementById("a-GuitarSound").addEventListener("click", () => {
    sampler = new Tone.Sampler({
        urls: {
            "A3": "A3.mp3",
            "B3": "B3.mp3",
            "C4": "C4.mp3",
            "C#4": "Cs4.mp3",
        },
        release: 1,
        baseUrl: "/aGuitarNotes/",
    }).toDestination();
})
// -- change sound to acoustic guitar end --

// -- change sound to flute start --
document.getElementById("fluteSound").addEventListener("click", () => {
    sampler = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "E4": "E4.mp3",
            "A4": "A4.mp3",
        },
        release: 1,
        baseUrl: "/fluteNotes/",
    }).toDestination();
})
// -- change sound to flute end --

// -- function to change sound  start - -
// only works for sound which i could find same sample notes
function changeSound(id, url) {
    document.getElementById(id).addEventListener("click", () => {
        sampler = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                "A4": "A4.mp3",
            },
            release: 1,
            baseUrl: url,
        }).toDestination();
    })
}
// -- function to change sound end --

changeSound("celloSound", "/celloNotes/");
changeSound("pianoSound", "/pianoNotes/");
changeSound("saxophoneSound", "/saxNotes/");
changeSound("e-GuitarSound", "/eGuitarNotes/");


// -- hithat select start --
document.getElementById("hihatselect").addEventListener("change", () => {
    let value = document.getElementById("hihatselect").value;
    Tone.Transport.start();
    console.log(value);
    if (value == 1) {
        console.log(value);
        hihat = new Tone.Player("./samples/CYCdh_K1close_ClHat-01.wav").toDestination();
    } else if (value == 2) {
        hihat = new Tone.Player("./samples/CYCdh_K1close_ClHat-05.wav").toDestination();
    } else if (value == 3) {
        hihat = new Tone.Player("./samples/CYCdh_K1close_ClHat-04.wav").toDestination();
    } else if (value == 4) {
        hihat = new Tone.Player("./samples/CYCdh_K1close_ClHat-08.wav").toDestination();
    }
})
// -- hithat select end --


// -- snare select start --
document.getElementById("snareselect").addEventListener("change", () => {
    Tone.Transport.start();
    let value = document.getElementById("snareselect").value;
    if (value == 1) {
        snare = new Tone.Player("./samples/CYCdh_K1close_Snr-02.wav").toDestination();
    } else if (value == 2) {
        snare = new Tone.Player("./samples/CYCdh_K1close_SnrOff-04.wav").toDestination();
    } else if (value == 3) {
        snare = new Tone.Player("./samples/CYCdh_K1close_Snr-03.wav").toDestination();
    } else if (value == 4) {
        snare = new Tone.Player("./samples/CYCdh_K1close_Snr-05.wav").toDestination();
    }
})
// -- snare select end --

// -- rim select start --
document.getElementById("rimselect").addEventListener("change", () => {
    Tone.Transport.start();
    let value = document.getElementById("rimselect").value;
    console.log(value);
    if (value == 1) {
        rim = new Tone.Player("./samples/CYCdh_K1close_Rim-01.wav").toDestination();
    } else if (value == 2) {
        rim = new Tone.Player("./samples/CYCdh_K1close_Rim-05.wav").toDestination();
    } else if (value == 3) {
        rim = new Tone.Player("./samples/CYCdh_K1close_Rim-03.wav").toDestination();
    } else if (value == 4) {
        rim = new Tone.Player("./samples/CYCdh_K1close_Rim-04.wav").toDestination();
    }
})
// -- rim select end --

// -- side select start --
document.getElementById("sideselect").addEventListener("change", () => {
    Tone.Transport.start();
    let value = document.getElementById("sideselect").value;
    console.log(value);
    if (value == 1) {
        sdst = new Tone.Player("./samples/CYCdh_K1close_SdSt-01.wav").toDestination();
    } else if (value == 2) {
        sdst = new Tone.Player("./samples/CYCdh_K1close_SdSt-03.wav").toDestination();
    } else if (value == 3) {
        sdst = new Tone.Player("./samples/CYCdh_K1close_SdSt-05.wav").toDestination();
    } else if (value == 4) {
        sdst = new Tone.Player("./samples/CYCdh_K1close_SdSt-07.wav").toDestination();
    }
})
// -- side select end --

// -- kick select start --
document.getElementById("kickselect").addEventListener("change", () => {
    let value = document.getElementById("kickselect").value;
    console.log(value);
    if (value == 1) {
        kick = new Tone.Player("./samples/CYCdh_K1close_Kick-03.wav").toDestination();
    } else if (value == 2) {
        kick = new Tone.Player("./samples/CYCdh_K1close_Kick-04.wav").toDestination();
    } else if (value == 3) {
        kick = new Tone.Player("./samples/CYCdh_K1close_Kick-07.wav").toDestination();
    } else if (value == 4) {
        kick = new Tone.Player("./samples/CYCdh_K1close_Kick-08.wav").toDestination();
    }
})
// -- kick select end --
