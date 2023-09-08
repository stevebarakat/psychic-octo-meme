import {
  justDance,
  roxanne,
  aDayInTheLife,
  blueMonday,
  ninteenOne,
} from "@/assets/songs";
import { MixerMachineContext } from "@/context/MixerMachineContext";

function SongSelect() {
  const { send } = MixerMachineContext.useActorRef();
  function onChange(e: React.FormEvent<HTMLSelectElement>): void {
    switch (e.currentTarget.value) {
      case "ninteenOne": {
        send({
          type: "LOAD_SONG",
          value: ninteenOne,
        });
        break;
      }
      case "roxanne": {
        send({
          type: "LOAD_SONG",
          value: roxanne,
        });
        break;
      }
      case "aDayInTheLife": {
        send({
          type: "LOAD_SONG",
          value: aDayInTheLife,
        });
        break;
      }
      case "blueMonday": {
        send({
          type: "LOAD_SONG",
          value: blueMonday,
        });
        break;
      }
      case "justDance": {
        send({
          type: "LOAD_SONG",
          value: justDance,
        });
        break;
      }

      default:
        break;
    }
  }

  return (
    <select name="songs" id="song-select" onChange={onChange}>
      <option value="">Choose a song:</option>
      <option value="ninteenOne">Phoenix - 1901</option>
      <option value="roxanne">The Police - Roxanne</option>
      <option value="aDayInTheLife">The Beatles - A Day In The Life</option>
      <option value="blueMonday">New Order - Blue Monday</option>
      <option value="justDance">Lady Gaga - Just Dance</option>
    </select>
  );
}

export default SongSelect;
