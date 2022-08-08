import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Header from "../Header/Header";
import Search from "../Search/Search";
import './PostPage.css';
import leftArrow from '../../assets/leftArrow.png';
// import greenUpThumb from '../../assets/greenUpThumb.png';
import postUserProfile from '../../assets/postUserProfile.png';
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import axios from "axios";
import Comments from "./Comments/Comments";
import WriteComment from "./WriteComment/WriteComment";
import postMenuIcon from "../../assets/postMenuIcon.png";
import greenHeart from '../../assets/greenHeart.png';
import whiteHeart from '../../assets/whiteHeart.png';
import scrappedIcon from '../../assets/scrapped.png';
import unScrappedIcon from '../../assets/unScrapped.png';
import { getTimeAfterCreated } from "../../utils/getTimeAfterCreated";
import { PostScrapSnackbar } from "./PostScrapSnackbar/PostScrapSnackbar";
import PostReportOtherModal from "./PostReportOtherModal/PostReportOtherModal";
import PostMenuModal from "./PostMenuModal/PostMenuModal";
import PostReportSnackbar from "./PostReportSnackbar/PostReportSnackbar";

export default function PostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const params = useParams();
  const { boardId, postId } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [comments, setComments] = useState([]);
  const [isPostSettingModalOn, setIsPostSettingModalOn] = useState(false);
  const [post, setPost] = useState(null);
  const { userIdx, userName, userId, userBirthday, jwt, refreshToken } = JSON.parse(localStorage.getItem('userData'));
  const [postLikeStatus, setPostLikeStatus] = useState(null);
  const [commentReported, setCommentReported] = useState(0);
  const [pureStatus, setPureStatus] = useState(true);
  const [postLikes, setPostLikes] = useState(0);
  const [rootCommentIdx, setRootCommentIdx] = useState(null);
  const [placeHolder, setPlaceHolder] = useState('댓글쓰기');
  const [inputRef, setInputRef] = useState(null);
  const [scrapSnackbarOpen, setScrapSnackbarOpen] = useState(false);
  const [reportSnackbarOpen, setReportSnackbarOpen] = useState(false);
  const [postScrapStatus, setPostScrapStatus] = useState(null);
  const [postReportDetailOn, setPostReportDetailOn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const scrapped = searchParams.get('scrapped');
  const headers = {
    'ACCESS-TOKEN': jwt,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  console.log(location);
  useEffect(() => {
      fetchPost(postId);
      fetchComments(postId);
      document.addEventListener('mousedown', clickModalOutside);

      return () => {
        document.addEventListener('mousedown', clickModalOutside);
      }
    }, []);

  useEffect(() => {
    if (!post) {
      return;
    }
    console.log(post);
    if (post.userLike) {
      console.log('2', post.likeNumber);
      setPostLikes(post.likeNumber);
      setPostLikeStatus(true);
    } else if (!post.userLike) {
      console.log(3);
      setPostLikeStatus(false);
    }

    if (post.userScrap) {
      console.log(4);
      setPostScrapStatus(true);
    } else if (!post.userScrap) {
      console.log(5);
      setPostScrapStatus(false);
    }
  }, [post]);

  useEffect(() => {
    if (postLikeStatus !== null && !pureStatus) {
      if (postLikeStatus) {
        setPostLikes(state => state + 1);
      } else {
        setPostLikes(state => state - 1);
    }
    }
  }, [postLikeStatus, pureStatus]);

  useEffect(() => {
    if (commentReported === 0) return;
    fetchComments(postId);
  }, [commentReported]);

  const fetchPost = async (postIdx) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`/api/post/get/${postIdx}`, { headers });
      setPost(response.data.result);
      console.log(response);
    } catch (e) {
      setError(e);
      console.log(e);
    }
    setLoading(false);
  };

  const fetchComments = async (postIdx) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`/api/comment/get/${postIdx}`,
        JSON.stringify({}),
        { headers });
      if (response.data.isSuccess) {
        console.log(1, response.data.result);
        setComments(response.data.result);
      }
      console.log(response);
    } catch (e) {
      setError(e);
      console.log(e);
    }
    setLoading(false);
  };

  const clickModalOutside = e => {
    if (e.target.className === "ReactModal__Overlay ReactModal__Overlay--after-open") {
      setPostReportDetailOn(false);
    }
  };

  const handleCommentDelete = async (e, commentIdx) => {
    const deletePost = async (commentIdx) => {
      try {
        const response = await axios.patch(`/api/comment/delete/${commentIdx}`,
          JSON.stringify({}),
          { headers }
        );
        console.log(response.data);
        if (response.data.isSuccess) {
          setComments(state => state.filter(comment => comment.commentIdx !== commentIdx));
        }
      } catch (error) {
        console.log(error);
      }
    };
    deletePost(commentIdx);
  };

  const handleReportComment = (e, commentIdx, reason) => {
    const reportComment = async (commentIdx, reason) => {
      try {
        const response = await axios.post(`/api/report/commentReport`,
          JSON.stringify({
            commentIdx: parseInt(commentIdx),
            reason: reason
          }),
          { headers });
          console.log(response);
          if (response.data.isSuccess) {
            setComments(state => state.filter(comment => comment.commentIdx !== commentIdx));
          }
      } catch (error) {
        console.log(error);
      }
    };
    // console.log(parseInt(commentIdx), e.target.innerText);
    if (e.target.innerText !== '네') {
      reportComment(parseInt(commentIdx), e.target.innerText);
    } else {
      reportComment(parseInt(commentIdx), reason);
    }
    setReportSnackbarOpen(true);
  };

  const handleEnterInput = (e, content, authorName) => {
    const uploadComment = async (userIdx, postIdx, content, authorName) => {
      try {
        const response = await axios.post(`/api/comment/replyOnPost/create`,
          JSON.stringify(
            {
              userIdx: userIdx,
              postIdx: postIdx,
              content: content,
              authorName: authorName
            }),
            { headers }
        );

        console.log(response.data.result);
        setComments(state => {
          return [
            ...state,
            response.data.result
          ];
        });

      } catch (e) {
        console.log(e);
        setError(e);
      }
    };

    const uploadReComment = async (userIdx, postIdx, rootCommentIdx, content, authorName) => {
      try {
        const response = await axios.post(`/api/comment/replyOnReply/create`,
          JSON.stringify(
            {
              userIdx,
              postIdx,
              rootCommentIdx,
              content,
              authorName
            }),
            { headers }
        );

        console.log(response.data.result);
        setComments(state => {
          return [
            ...state,
            response.data.result
          ];
        });
      } catch (e) {
        console.log(e);
        setError(e);
      }
    };

    if (rootCommentIdx === null) {
      uploadComment(userIdx, postId, content, authorName);
    } else {
      uploadReComment(userIdx, postId, rootCommentIdx, content, authorName);
    }
  };

  const handleReportClick = () => {
    setPostReportDetailOn(true);
  };

  const handleModalCloseClick = () => {
    setIsPostSettingModalOn(false);
  };

  useLayoutEffect(() => {
    if (isPostSettingModalOn) {
      setPostReportDetailOn(false);
    }

  }, [isPostSettingModalOn]);

  const handleReportPost = (e) => {
    const reportPost = async (postIdx, reason) => {
      try {
        const response = await axios.post(`/api/report/postReport`,
          JSON.stringify({
            postIdx: postIdx,
            reason: reason
          }),
          { headers });
          console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    reportPost(parseInt(postId), e.target.innerText);
    setIsPostSettingModalOn(false);
    setReportSnackbarOpen(true);
  };

  const handleScrapSnackbarClose = (e, reason) => {
    if (reason === 'clickway') {
      return;
    }

    setScrapSnackbarOpen(false);
  };

  const handleReportSnackbarClose = (e, reason) => {
    if (reason === 'clickway') {
      return;
    }

    setReportSnackbarOpen(false);
  };

  const postLike = async (userIdx, postIdx, likeStatus) => {
    try {
      const response = await axios.post(`/api/post/like`,
        {
          postIdx: postIdx,
          userIdx: userIdx,
          likeStatus: likeStatus
        },
        { headers }
        );
      console.log(response);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const postCancelLike = async (userIdx, postIdx) => {
    try {
      const response = await axios.patch('/api/post/like/cancel',
        {
          postIdx: postIdx,
          userIdx: userIdx
        },
        { headers }
        );
        console.log(response);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const postCancelScrap = async (postIdx) => {
    try {
      const response = await axios.post(`/api/post/unscrap/${postIdx}`,
        JSON.stringify({}),
        { headers }
        );
        console.log(response);
        setPostScrapStatus(false);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const postScrap = async (postIdx) => {
    console.log(postIdx);
    try {
      const response = await axios.post(`/api/post/scrap/${postIdx}`,
        JSON.stringify({}),
        { headers }
        );
        console.log(response);
        setPostScrapStatus(true);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };
  const [postReportOtherModalOn, setPostReportOtherModalOn] = useState(false);
  const handleReportOtherClick = () => {
    setPostReportOtherModalOn(true);
    // setIsPostSettingModalOn(false);
    handleModalCloseClick();
  };

  return (
    <>
      <Header />
      <Search />
      <div className="post-container">
        <div className='board-title-box'>
          <button className='back-button' onClick={() => navigate(`/boards/${boardId}?scrapped=${scrapped}`)}>
            <img src={leftArrow} alt=''/>
          </button>
          <div className='board-title'>{state.boardName}</div>
        </div>
        {(!loading && !error && post) &&
          <>
            <PostMenuModal
              isOpen={isPostSettingModalOn}
              onRequestClose={handleModalCloseClick}
              post={post}
              postReportDetailOn={postReportDetailOn}
              handleReportPost={handleReportPost}
              handleReportOtherClick={handleReportOtherClick}
              handleReportClick={handleReportClick}
              handleModalCloseClick={handleModalCloseClick}
              setReportSnackbarOpen={setReportSnackbarOpen}
            />
            <PostReportOtherModal
              isOpen={postReportOtherModalOn}
              onRequestClose={() => setPostReportOtherModalOn(false)}
              setReportSnackbarOpen={setReportSnackbarOpen}
            />
            <div className="post-subject">
            <div className="post-title-container">
              <div className="post-title-wrapper">
                <div className="post-title-box">{post.postName}</div>
                <div className="post-comment-number">({comments.length})</div>
                <button className="post-menu-button" onClick={() => setIsPostSettingModalOn(state=>!state)}>
                  <img className="post-menu-icon" src={postMenuIcon} alt=""/>
                </button>
              </div>
              <div className="post-elapsed-time">{getTimeAfterCreated(post.timeAfterCreated)}</div>
            </div>
            <div className="post-user-info">
              <div className="post-user-profile">
                <img src={postUserProfile} alt="엑박" />
              </div>
              <div className="post-user-nickname">{post.authorName} &gt;</div>
            </div>
            </div>
            <div className="post-main-content">{post.contents}</div>
            <div className="post-button-container">
              {postLikeStatus ?
                <>
                  <button className='like-status-button' onClick={() => {
                    setPostLikeStatus(false);
                    setPureStatus(false);
                    postCancelLike(userIdx, postId);
                  }}>
                  <div className="liked-inpost-like-number">{postLikes}</div>
                  <img src={greenHeart} alt=""/>
                  추천
                  </button>
                </>
                :
                <>
                  <button className='default-status-button' onClick={() => {
                    setPostLikeStatus(true);
                    setPureStatus(false);
                    postLike(userIdx, postId, "LIKE");
                  }}>
                    <div className="default-inpost-like-number">{postLikes}</div>
                    <img src={whiteHeart} alt="" />
                    <div>추천</div>
                  </button>
                </>
              }
              {postScrapStatus ?
                <>
                  <button className='scrap-status-button' onClick={() => {
                    setPostScrapStatus(false);
                    postCancelScrap(postId)}}
                  >
                    <img src={scrappedIcon} alt=""/>
                    <div>스크랩</div>
                  </button>
                </> :
                <>
                  <button className='default-status-scrap-button' onClick={() => {
                    setScrapSnackbarOpen(true);
                    setPostScrapStatus(true);
                    postScrap(postId)}}
                  >
                    <img src={unScrappedIcon} alt="" />
                    <div>스크랩</div>
                  </button>
                </>
              }
            </div>
            {comments &&
              <Comments
                comments={comments}
                setRootCommentIdx={setRootCommentIdx}
                setPlaceHolder={setPlaceHolder}
                inputRef={inputRef}
                handleCommentDelete={handleCommentDelete}
                setCommentReported={setCommentReported}
                handleReportComment={handleReportComment}
              />
            }
          </>
        }
      </div>
        <WriteComment
          handleEnterInput={handleEnterInput}
          authorName={userName}
          rootCommentIdx={rootCommentIdx}
          placeHolder={placeHolder}
          setInputRef={setInputRef}
          setPlaceHolder={setPlaceHolder}
          setRootCommentIdx={setRootCommentIdx}
        />
       <PostScrapSnackbar handleClose={handleScrapSnackbarClose} open={scrapSnackbarOpen}/>
       <PostReportSnackbar handleClose={handleReportSnackbarClose} open={reportSnackbarOpen}/>
       <div className="bottom-bar-blocker" ></div>
    </>
  );
}
