export default function Taskbar(){
    return(
        <div className="taskbar">
                    <h2 style={{paddingLeft:"20px"}}>{title}</h2>
                    <Account 
                      name={name}
                    />   
            </div>
    );
}