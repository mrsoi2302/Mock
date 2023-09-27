package com.example.demo.DataType;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class Value<T> {
    private T t;
    private String value;
}
