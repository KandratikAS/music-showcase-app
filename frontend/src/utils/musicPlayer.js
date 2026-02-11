import * as Tone from "tone";
import { Faker, en } from "@faker-js/faker";

let currentInstruments = [];
let currentParts = [];

export const cleanup = () => {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    currentParts.forEach(part => part.dispose());
    currentParts = [];
    currentInstruments.forEach(inst => inst.dispose());
    currentInstruments = [];
};

const GENRES = {
    "Pop":        { scale: ["C4","D4","E4","G4","A4"], wave: "sine", tempoRange: [100,130], bass: ["C2","G2"], kickPattern: [1,0,0.5,0,1,0,0.5,0] },
    "Rock":       { scale: ["A3","C4","D4","E4","G4"], wave: "triangle", tempoRange: [90,120], bass: ["A2","E3"], kickPattern: [1,0,1,0,1,0,1,0] },
    "Rap":        { scale: ["C4","D#4","F4","G4","A#4"], wave: "square", tempoRange: [80,100], bass: ["C2","F2"], kickPattern: [1,0,0.25,0,1,0,0.25,0] },
    "Électronique": { scale: ["C4","E4","G4","B4"], wave: "sawtooth", tempoRange: [120,140], bass: ["C2","G2"], kickPattern: [1,0,0.5,0,0.75,0,0.5,0] },
    "Indé":       { scale: ["D4","F4","A4","C5"], wave: "sine", tempoRange: [90,110], bass: ["D2","A2"], kickPattern: [1,0,0,0.5,1,0,0,0.5] },
    "Chill":      { scale: ["C4","E4","G4","A4"], wave: "sine", tempoRange: [60,90], bass: ["C2","G2"], kickPattern: [1,0,0,0,0.5,0,0,0] },
    "House":      { scale: ["C4","D4","E4","G4"], wave: "sawtooth", tempoRange: [120,130], bass: ["C2","G2"], kickPattern: [1,0,1,0,1,0,1,0] },
    "Techno":     { scale: ["C4","D4","F4","G4"], wave: "sawtooth", tempoRange: [125,140], bass: ["C2","F2"], kickPattern: [1,0,0.5,0,0.5,0,0.25,0] },
    "R&B":        { scale: ["C4","D4","E4","G4","A4"], wave: "triangle", tempoRange: [70,100], bass: ["C2","A2"], kickPattern: [1,0,0,0.5,1,0,0,0.5] },
    "Jazz":       { scale: ["D4","F4","G4","A4","C5"], wave: "sine", tempoRange: [70,110], bass: ["D2","A2"], kickPattern: [1,0,0.25,0,0.5,0,0.25,0] },
    "Soul":       { scale: ["C4","E4","G4","A4","B4"], wave: "triangle", tempoRange: [70,100], bass: ["C2","G2"], kickPattern: [1,0,0,0.5,1,0,0,0.5] },
    "Alternative":{ scale: ["A3","C4","D4","E4","G4"], wave: "triangle", tempoRange: [90,120], bass: ["A2","E3"], kickPattern: [1,0,1,0,1,0,1,0] },
    "Funk":       { scale: ["C4","D4","E4","G4","A4"], wave: "square", tempoRange: [90,120], bass: ["C2","G2"], kickPattern: [1,0,0.5,0,1,0,0.5,0] },
    "Lo-fi":      { scale: ["C4","E4","G4","A4"], wave: "sine", tempoRange: [60,90], bass: ["C2","G2"], kickPattern: [1,0,0,0,0.5,0,0,0] },
};

export const playSong = async (songId, genreName) => {
    cleanup();  
    
    const genre = GENRES[genreName] || GENRES["Pop"];
    const rng = new Faker({ locale: [en] });
    rng.seed(songId);

    const transport = Tone.getTransport();
    transport.bpm.value = rng.number.int({ min: genre.tempoRange[0], max: genre.tempoRange[1] });


    const lead = new Tone.Synth({ oscillator: { type: genre.wave }, envelope: { attack: 0.1, release: 0.5 } }).toDestination();
    const bass = new Tone.MonoSynth({ oscillator: { type: "square" }, envelope: { attack: 0.1, release: 1 } }).toDestination();
    const kick = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 10, envelope: { attack: 0.001, decay: 0.3, sustain: 0 } }).toDestination();
    const hihat = new Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 0.1 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000 }).toDestination();

    currentInstruments.push(lead, bass, kick, hihat);

    const leadPart = new Tone.Part((time) => {
        lead.triggerAttackRelease(rng.helpers.arrayElement(genre.scale), "8n", time);
    }, Array.from({ length: 16 }, (_, i) => i * 0.25));

    const bassPart = new Tone.Part((time) => {
        bass.triggerAttackRelease(rng.helpers.arrayElement(genre.bass), "4n", time);
    }, Array.from({ length: 8 }, (_, i) => i * 0.5));

    const kickPart = new Tone.Part((time, step) => {
        if (genre.kickPattern[step % genre.kickPattern.length]) {
            kick.triggerAttackRelease("C2", "8n", time);
        }
    }, Array.from({ length: 16 }, (_, i) => [i * 0.25, i]));

    const hihatLoop = new Tone.Loop(time => {
        hihat.triggerAttackRelease("16n", time);
    }, "8n");

    currentParts.push(leadPart, bassPart, kickPart, hihatLoop);

    leadPart.start(0);
    bassPart.start(0);
    kickPart.start(0);
    hihatLoop.start(0);

    transport.seconds = 0;
    transport.start();

    setTimeout(() => transport.stop(), 7000);

    return () => cleanup();
};