import { Document, Image, Page, Text, View, Line } from "@react-pdf/renderer";
import es from 'date-fns/locale/es';
import { format } from 'date-fns'

const Recepepdf = ({ date, firstname, lastname }: any) => {
  const getTextUntilSpace = (text: string) => {
    const firstSpaceIndex = text.indexOf(" ");
    return firstSpaceIndex !== -1 ? text.substring(0, firstSpaceIndex) : text;
  }
  return (
    <>
      {date && (
        <Document>
          <Page
            size="A4"
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 20,
                justifyContent: "center",
              }}
            >
              <Image src="./logo.jpg" style={{ width: '100%' }} />

            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 14, }}>
                Dr. {date?.specialist?.firstname} {date?.specialist?.lastname}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop:10,
                marginHorizontal:20
              }}
            >
              <Text style={{ fontSize: 14 }}>
                <Text style={{fontFamily:"Helvetica-Bold"}}>Paciente: </Text>{date?.patient?.firstname} {date?.patient?.lastname}{" "}
                {firstname} {lastname}
              </Text>
              <Text style={{ fontSize: 14 }}>
                <Text style={{fontFamily:"Helvetica-Bold"}}>Fecha: </Text>{format(new Date(date?.start), "'Quito, a 'd 'de' MMMM 'del' yyyy", { locale: es })}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              
            </View>

            {date?.record?.recipe[0] ? (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 20,
                    textAlign: "left",
                    marginLeft:20
                  }}
                >
                  <Text style={{ fontSize: 14, marginBottom:5, fontFamily:"Helvetica-Bold"}}>MEDICAMENTOS</Text>
                </View>
                {date?.record?.recipe.map((reci: any, index: any) => {
                  return (
                    <>
                      <View
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          
                          marginLeft: 50,
                          marginRight: 50,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            marginRight: 5,
                            marginBottom:5
                          }}
                        >
                          -{reci?.name} 
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>
              
            ) : (
              ""
            )}

            {date?.record?.recipe[0] ? (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 20,
                    textAlign: "left",
                    marginLeft:20
                  }}
                >
                  <Text style={{ fontSize: 14, marginBottom:5, fontFamily:"Helvetica-Bold"}}>OBSERVACIONES</Text>
                </View>
                {date?.record?.recipe.map((reci: any, index: any) => {
                  return (
                    <>
                      <View key={index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: 50,
                          marginRight: 50,
                          textAlign:"left"
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            marginRight: 5,
                            marginLeft:5,
                            marginBottom:5
                          }}
                          >
                          - {getTextUntilSpace(reci?.name)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginRight: 5,
                            marginLeft:5
                          }}
                          >
                          Dosis: {reci?.dose}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginRight: 5
                          }}
                          >
                          Frecuencia: {reci?.frequency}
                        </Text> 
                      </View>
                    </>
                  );
                })}
              </View>
            ) : (
              ""
            )}

            {date?.record?.care[0] ? (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 20,
                    justifyContent: "flex-start",
                    marginLeft:20
                  }}
                >
                  <Text style={{ fontSize: 14,fontFamily:"Helvetica-Bold", marginBottom:5}}>CUIDADO DE LA HERIDA</Text>
                </View>
                {date?.record?.care.map((care: any, index: any) => {
                  return (
                    <View
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 50,
                        marginRight: 50,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          marginRight: 5,
                        }}
                      >
                        {care?.description}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              ""
            )}

            {date?.record?.diet[0] ? (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 20,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>DIETA</Text>
                </View>
                {date?.record?.diet.map((diet: any, index: any) => {
                  return (
                    <View
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 50,
                        marginRight: 50,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          marginRight: 5,
                        }}
                      >
                        {diet?.description}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              ""
            )}

            {date?.record?.activity[0] ? (
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 20,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>ACTIVIDAD</Text>
                </View>
                {date?.record?.activity.map((acti: any, index: any) => {
                  return (
                    <View
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 50,
                        marginRight: 50,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          marginRight: 5,
                        }}
                      >
                        {acti?.description}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              ""
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 70,
                marginLeft: 40,
              }}
            >
              <Image
                src="./phone.png"
                style={{ marginRight: 7, maxWidth: "20px", maxHeight: "20" }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: 30,
                }}
              >
                <Text style={{ fontSize: 14 }}>(55) 123-5678</Text>
                <Text style={{ fontSize: 14 }}>(55) 123-5678</Text>
              </View>

              <Image
                src="./location.png"
                style={{ marginRight: 7, maxWidth: "20px", maxHeight: "20" }}
              />

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: 30,
                }}
              >
                <Text style={{ fontSize: 14 }}>Calle Quitumbe 123</Text>
                <Text style={{ fontSize: 14 }}>Quito, Chillogallo</Text>
              </View>
              <Image
                src="./internet.png"
                style={{ marginRight: 7, maxWidth: "20px", maxHeight: "20" }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: 30,
                  textAlign: "right",
                }}
              >
                <Text style={{ fontSize: 14 }}>{date?.specialist?.email}</Text>
                <Text style={{ fontSize: 14 }}>bypassgastricoec.web.app</Text>
              </View>
            </View>
          </Page>
        </Document>
      )}
    </>
  );
};

export default Recepepdf;
