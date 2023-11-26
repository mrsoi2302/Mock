package com.example.demo.Service;

import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentGroup;
import com.example.demo.Repositories.PaymentGroupRepository;
import com.example.demo.Repositories.PaymentRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentGroupService {
    private final PaymentGroupRepository paymentGroupRepository;
    private final PaymentRepo paymentRepo;
    public PaymentGroupService(PaymentGroupRepository paymentGroupRepository, PaymentRepo paymentRepo) {
        this.paymentGroupRepository = paymentGroupRepository;
        this.paymentRepo = paymentRepo;
    }

    public List<PaymentGroup> list(String value) {
        return paymentGroupRepository.list(value);
    }

    public PaymentGroup findByCode(String code) {
        return paymentGroupRepository.findByCode(code);
    }

    public void save(PaymentGroup paymentGroup) {
        paymentGroupRepository.save(paymentGroup);
    }

    public void deleteByListCode(List<String> listCode) {
        for(String i:listCode){
            PaymentGroup p=paymentGroupRepository.findByCode(i);
            List<Payment> list=paymentRepo.findByPaymentGroup(p);
            for(Payment j:list){
                int index=list.indexOf(j);
                j.setPaymentGroup(null);
                list.set(index,j);
            }
            paymentGroupRepository.delete(p);
        }
    }
}
