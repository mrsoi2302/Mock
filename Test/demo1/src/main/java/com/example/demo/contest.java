package com.example.demo;


import java.util.*;
class Vector{
    int x1,y1,x2,y2;
    int x,y;
    public Vector(int x1, int y1, int x2, int y2) {
        this.x=x2-x1;
        this.y=y2-y1;
    }
}
public class contest {

    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int tc=sc.nextInt();
        String t= sc.nextLine();
        while(tc-->0){
            int x11,y11,x12,y12,x21,x22,y21,y22;
            x11= sc.nextInt();
            y11= sc.nextInt();
            x12= sc.nextInt();
            y12= sc.nextInt();
            x21= sc.nextInt();
            y21= sc.nextInt();
            x22= sc.nextInt();
            y22= sc.nextInt();
            Vector v1=new Vector(x11,y11,x12,y12);
            Vector v2=new Vector(x21,y21,x22,y22);
            
        }
    }
}
