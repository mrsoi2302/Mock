import React from "react";
import Filter from "./Filter";
import { Input } from "antd";
import Search from "antd/es/input/Search";
{/* <SearchInput
          setValue={props.setValue}
          filter={props.filter}
          openFilter={props.openFilter}
          setOpenFilter={props.setOpenFilter}
          groups={props.groups}
        /> */}
export default function SearchInput(props){
    return (
        <div style={{display:"grid" , gridTemplateColumns:"15% 85%"}}>
            <Filter
                open={props.openFilter}
                setOpen={props.setOpenFilter}
                items={props.filter}
            />
            <Search
            enterButton
            onChange={e=>{props.setValue(e.target.value)}}/>
        </div>
    )
}