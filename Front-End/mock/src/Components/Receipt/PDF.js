import React from "react";
import { Page, Text, Image, Document, StyleSheet, Font } from "@react-pdf/renderer";
import MyFont from '../font-times-new-roman.ttf'
    Font.register({
        family: 'Times New Roman',
        src:MyFont
    })
  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
        margin:12,
      fontSize: 24,
      textAlign: "center",
      fontFamily:"Times New Roman"
    },
    text: {
      margin: 12,
      marginLeft:40,
      fontSize: 14,
      textAlign: "left",
      fontFamily:"Times New Roman"
  
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "grey",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
  });
  
  const PDF = (props) => {
  
    const pageColors = ['#f6d186', '#f67280', '#c06c84'];
  
    const pages = [
      {text: 'Second page content goes here...', image: 'https://www.si.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTcwMzExMzEwNTc0MTAxODM5/lebron-dunk.jpg' },
      {text: 'Third page content goes here...', image: 'https://s.yimg.com/ny/api/res/1.2/Aj5UoHHKnNOpdwE6Zz9GIQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MA--/https://s.yimg.com/os/creatr-uploaded-images/2023-01/b02a71d0-a774-11ed-bf7f-08714e8ad300' },
    ]
  
    return (
      <Document>
        <Page>
            <Text style={styles.title}>Hóa đơn</Text>
            <Text style={styles.text}>
                Mã hóa đơn:{props.data.code}
            </Text>
            <Text style={styles.text}>
                Giá trị:{props.data.revenue}
            </Text>
            <Text style={styles.text}>
                Người thanh toán:{props.data.provider.name}
            </Text>
            <Text style={styles.text}>
                Hình thức thanh toán:{props.data.receiptType.name}
            </Text>
            <Text style={{...styles.text}}>
                Người thanh toán                                         Người nhận
            </Text>
            <Text style={{...styles.text, display:"flex",float:"right"}}>
                
            </Text>
          </Page>
  
      </Document>
    );
  };
  
  export default PDF;