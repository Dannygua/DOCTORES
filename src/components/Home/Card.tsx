import { Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LinkedinOutlined,TwitterOutlined,InstagramOutlined} from "@ant-design/icons"

const CardComponent = ({heightCard,image,title,subtitle, content,contentTwo,contentThree,Icons,Linkedin,Twitter,Instagram}:any) => {
    const { Meta } = Card;

  return (
    <div className='individual-Card'>

    
        <Card
         hoverable
         style={{ width: 250 }}
         className={
            heightCard === "first" ? "firstBanner": heightCard === "second" ? "secondBanner" : "thirdBanner"
          }
         cover={<img className='imageCard' alt="example" src={image} />}>
            <Meta 
            title={title} description={subtitle} />
            <p>{content}</p>
            <p>{contentTwo}</p>
            <p>{contentThree}</p>
            {
                Icons && (
                    <>
                    <Button type="text" href={Linkedin}>
                        <LinkedinOutlined />
                    </Button>
                    <Button type="text" href={Twitter}>
                        <TwitterOutlined />
                    </Button>
                    <Button type="text" href={Instagram}>
                        <InstagramOutlined />
                    </Button>
                    </>

                
                )

            }
        </Card>
    </div>
  )
}

export default CardComponent
