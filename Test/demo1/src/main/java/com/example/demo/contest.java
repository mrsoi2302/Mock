package com.example.demo;

import java.util.*;

class Device{
    private String code,name;
    private int quantity;
    private long price,reduce,total;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public long getReduce() {
        return reduce;
    }

    public void setReduce(long reduce) {
        this.reduce = reduce;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public Device(String code, String name, int quantity, long price, long reduce, long total) {
        this.code = code;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.total=total;
        this.reduce = reduce;
        this.total=quantity*price-reduce;
    }
    public Device(Scanner sc){
        this.code = sc.next();
        String x=sc.nextLine();
        this.name = sc.nextLine();
        this.quantity = sc.nextInt();
        this.price = sc.nextLong();
        this.reduce = sc.nextLong();
        this.total=quantity*price-reduce;
    }

    @Override
    public String toString() {
        return  code+" "+name+" "+quantity+" "+price+" "+reduce+" "+total;
    }
}
public class contest{
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        List<Device> list=new ArrayList<>();
        int tc= sc.nextInt();
        while(tc-->0){
            Device device=new Device(sc);
            list.add(device);
        }

        Collections.sort(list,(l1,l2)->{
            return (int) (l2.getTotal()-l1.getTotal());
        });
        for(Device i:list){
            System.out.println(i);
        }
    }
}