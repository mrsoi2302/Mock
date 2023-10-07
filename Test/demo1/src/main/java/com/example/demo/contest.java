package com.example.demo;


import java.util.*;
class Department{
    String code;
    String name;

    public Department(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public Department(Scanner sc) {
        this.code=sc.next();
        this.name=sc.nextLine();
    }
}
class Employee{
    String code;
    String name;
    long wage;
    int workday;
    long monthwage;
    String department;
    public Employee(String code, String name, long wage, int workday,List<Department> list) {
        this.code = code;
        this.name = name;
        this.wage = wage;
        this.workday = workday;
        String type=code.substring(0,1);
        int time=Integer.parseInt(code.substring(1,3));
        String temp=code.substring(3);
        for(Department i:list){
            if(i.code.equals(temp)){
                this.department=i.name;
                break;
            }
        }
        if(type.equals("A")){
            if(time<=3){
                this.monthwage=wage*workday*10000*1;
            }else if(time<=8){
                this.monthwage= (long) (wage*workday*10000*1.2);
            }else if(time<=15){
                this.monthwage= (long) (wage*workday*10000*1.4);
            }else if(time>=16){
                this.monthwage= (long) (wage*workday*10000*20);
            }
        } else if (type.equals("B")) {
            if(time<=3){
                this.monthwage=wage*workday*10000*1;
            }else if(time<=8){
                this.monthwage= (long) (wage*workday*10000*1.1);
            }else if(time<=15){
                this.monthwage= (long) (wage*workday*10000*1.3);
            }else if(time>=16){
                this.monthwage= (long) (wage*workday*10000*1.6);
            }
        }else if (type.equals("C")) {
            if(time<=3){
                this.monthwage= (long) (wage*workday*10000*0.9);
            }else if(time<=8){
                this.monthwage= (long) (wage*workday*10000*1);
            }else if(time<=15){
                this.monthwage= (long) (wage*workday*10000*1.2);
            }else if(time>=16){
                this.monthwage= (long) (wage*workday*10000*1.4);
            }
        }else if (type.equals("D")) {
            if(time<=3){
                this.monthwage= (long) (wage*workday*10000*0.8);
            }else if(time<=8){
                this.monthwage= (long) (wage*workday*10000*0.9);
            }else if(time<=15){
                this.monthwage= (long) (wage*workday*10000*1.1);
            }else if(time>=16){
                this.monthwage= (long) (wage*workday*10000*1.3);
            }
        }
    }

    @Override
    public String toString() {
        return code+" "+name+" "+department+" "+monthwage;
    }
}
public class contest {
    public static void main(String[] args) {
        List<Department> list=new ArrayList<>();
        Scanner sc=new Scanner(System.in);
        int n= sc.nextInt();
        for(int i=0;i<n;i++){
            list.add(new Department(sc));
        }
        List<Employee> employees=new ArrayList<>();
        int m=sc.nextInt();
        for (int i=0;i<m;i++){
            String code=sc.next();
            String temp=sc.nextLine();
            String name= sc.nextLine();
            long wage=sc.nextLong();
            int time=sc.nextInt();
            employees.add(new Employee(code,name,wage,time,list));
        }
        for(Employee i:employees){
            System.out.println(i);
        }
    }
}
