package com.example.demo;

import java.util.*;

class Racer{
    String code="";
    String name;
    String location;
    int hour,minute;
    long speed;

    public Racer(Scanner sc) {
        String t=sc.nextLine();

        this.name=sc.nextLine();
        this.location=sc.nextLine();

        String time=sc.next();
        this.hour= Integer.parseInt(time.substring(0,1));
        this.minute= Integer.parseInt(time.substring(2));
        this.speed= Math.round( ((double)120/(((hour-6)*60)+minute))*60);
        StringTokenizer token1=new StringTokenizer(location);
        StringTokenizer token2=new StringTokenizer(name);
        while(token1.hasMoreTokens()){
            code=code+token1.nextToken().charAt(0);
        }
        while(token2.hasMoreTokens()){
            code =code + token2.nextToken().charAt(0);
        }
        code=code.toUpperCase();
    }

    @Override
    public String toString() {
        return code+" "+name+" "+speed+" Km/h";
    }
}
public class contest {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int tc= sc.nextInt();
        List<Racer> list=new ArrayList<>();
        while(tc-->0){
            Racer racer=new Racer(sc);
            list.add(racer);
        }
        Collections.sort(list,(r1,r2)->{
            return (int) (r2.speed-r1.speed);
        });
        for(Racer i:list){
            System.out.println(i);
        }
    }
}
