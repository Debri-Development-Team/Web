import recommentArrow from '../../../assets/recommentArrow.png';

export default function ReComment(props) {
  console.log('hi');
  const { reComment } = props;
  console.log(props);
  return (
    <div className="recomment-container">
      <div className="recomment-arrow-box">
        <img src={recommentArrow} alt='' className="recomment-arrow" />
      </div>
      <div className="recomment-main">
        <div className="recomment-content">{reComment.commentContent}</div>
        <div className="recomment-user">{reComment.authorName} ></div>
      </div>
      <div className="recomment-button-box"></div>
    </div>
  );
}