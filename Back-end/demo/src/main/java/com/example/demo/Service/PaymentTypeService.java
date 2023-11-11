package com.example.demo.Service;

import com.example.demo.Entities.Payment;
import com.example.demo.Entities.PaymentType;
import com.example.demo.Entities.Receipt;
import com.example.demo.Repositories.PaymentTypeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class PaymentTypeService {
    private PaymentTypeRepo paymentTypeRepo;
    private PaymentService paymentService;
    private ReceiptService receiptService;
    public List<PaymentType> list(String value) {
        return paymentTypeRepo.list(value);
    }

    public PaymentType findByName(String name) {
        return paymentTypeRepo.findByName(name);
    }

    public void save(PaymentType paymentType) {
        paymentTypeRepo.save(paymentType);
    }

    public void deleteByName(String name) {
        List<Payment> payments= paymentService.findByType(name);
        List<String> paymentCode=new ArrayList<>();
        for(Payment i:payments){
            paymentCode.add(i.getCode());
        }
        paymentService.deleteAllByCode(paymentCode);

        List<Receipt> receipts= receiptService.findByType(name);
        List<String> receiptCode=new ArrayList<>();
        for(Receipt i:receipts){
            receiptCode.add(i.getCode());
        }
        receiptService.deleteAllByCode(receiptCode);
        paymentTypeRepo.deleteByName(name);
    }


}
