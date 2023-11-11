package com.example.demo;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

public class contest {
    public static void main(String[] args) {
        List<String> list=new ArrayList<>();
        list.add("dung");
        list.add("tuan");
        for(String i:list){
            if (i.equals("dung")){
                int id=list.indexOf(i);
                list.set(id,"tuan");
            }
        }
        System.out.println(new Timestamp(System.currentTimeMillis() ).compareTo(new Date()));
    }


}
