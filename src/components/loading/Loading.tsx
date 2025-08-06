
import "./Loading.css";

interface LoadingProps {
  backgroundImage?: string;
}

const Loading = ({ backgroundImage }: LoadingProps) => {
  // Use the dzinly logo image on the rotating cubes
  const logoImage = "/assets/image/dzinlylogo-icon.svg";
  
  const boxStyle = {
    backgroundImage: `url(${backgroundImage || logoImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="select-create-project-loading">
      
      
  
      <div className="boxes">
    <div className="box">
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
    </div>
    <div className="box">
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
    </div>
    <div className="box">
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
    </div>
    <div className="box">
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
        <div style={boxStyle}></div>
    </div>
</div>


</div>



  );
};


export default Loading;
