import React ,{useState,useEffect}from 'react';
import axios from 'axios';
import './FavoriteBoards.css';
import toggleDown from '../../../assets/toggleDown.png';
import toggleUp from '../../../assets/toggleUp.png';
import favoriteStar from '../../../assets/favoriteStar.png';
import rightArrow from '../../../assets/rightArrow.png';
import { useNavigate } from 'react-router-dom';


export default function FavoriteBoards() {
  const navigate = useNavigate();
  const [isOpened, setIsOpened] = useState(true);
  const [scrapBoardList,setScrapBoardList] = useState(null);   //결과값
  const [loading,setLoading] = useState(false); // 로딩되는지 여부
  const [error,setError] = useState(null); //에러
  const [isSuccess, setIsSuccess] = useState(false);
  

  const headers = {
    'ACCESS-TOKEN': `${JSON.parse(localStorage.getItem("userData")).jwt}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const fetchScrapBoardList = async () => {
    try {
        setScrapBoardList(null);
        setError(null);
        setLoading(true); //로딩이 시작됨
        const response = await axios.get(`/api/board/scrap/getList`, { headers });
        setScrapBoardList(response.data);
        setIsSuccess(response.data.isSuccess);
        console.log('게시판 데이터',isSuccess)
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScrapBoardList();
  },[]);
  
  async function postData(boardIdx) {
    try {
      setScrapBoardList(null);
      setError(null);
      setLoading(true); //로딩이 시작됨
      const response = await axios.patch(`/api/board/scrap/cancel/${boardIdx}`,
        JSON.stringify({}),
        { headers }
      );
      console.log('리턴', response);
  
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setLoading(false);
  }

  function onCancelscrap(e){
    postData(e);
    fetchScrapBoardList();
  } 

  function handleFavoriteBoardsToggle() {
    setIsOpened(state => !state);
  }

  if (loading) return null;
  if (error) return null;

  return (
    <div className="favorite-boards">
      <div className="favorite-title">
        <p>즐겨찾기된 게시판</p>
        <button onClick={
          handleFavoriteBoardsToggle
        }>
          {isOpened ? <img src={toggleDown} alt="엑박"></img> : <img src={toggleUp} alt="엑박"></img>}
        </button>
      </div>
      {isOpened && isSuccess  &&
        <div>
          {scrapBoardList.result.map((board) => (
            <div className='board-menu' key={board.boardIdx}>
              <div>
                <button onClick={() => onCancelscrap(board.boardIdx)}>
                  <img src={favoriteStar} alt="엑박"></img>
                </button>
              </div>
              <div onClick={() => navigate(`/boards/${board.boardIdx}`)}>
                <div style={{display:'flex', alignItems:'center'}}>
                  <div>{board.boardName}</div>
                  <img src={rightArrow} alt="엑박" width="9.44px" height="16.19px" className='right-arrow'/>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
  </div>
  )
}