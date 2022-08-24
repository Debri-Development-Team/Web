import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist()

export const lowbarSelect = atom({
  key: 'lowbarSelect',
  default: {
    homeButton: true,
    lectureButton: false,
    boardButton: false,
    curriButton: false
  },
  effects_UNSTABLE: [persistAtom],
});
