package com.example.demo;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Scanner;
import java.util.Set;

public class contest {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n= sc.nextInt(),
        k=sc.nextInt();
        Set<Integer> set=new HashSet<>();
        for(int i=0;i<n;i++){
            int a= sc.nextInt();
            set.add(a);
        }
        Integer[] arr=set.toArray(new Integer[0]);
        if(arr[0]>0){
            
        }
    }
}
