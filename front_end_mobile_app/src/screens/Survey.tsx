import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import VvVwLogos from '../components/VvVwLogos';
import WeConnectLogoSmall from '../components/WeConnectLogoSmall';
import CountryDropDown from '../components/CountryDropDown';
import LanguageDropDown from '../components/LanguageDropDown';
import axios from 'axios';
import { getCookie } from '../../../front_end/src/global/Cookies';
import { stackScreens } from '../../App';

type propsType = NativeStackScreenProps<stackScreens, 'Survey'>;

// To pull from backend.
import { Baseline } from '../test-data/Baseline';
import { Main } from '../test-data/Main';
import { Service } from '../test-data/Service';
import { host } from './host';

const Survey = (props: propsType) => {
    let counter = 0;

    const EMPTY_STRING = '';
    const ZERO = 0;
    const LOWERCASE_A = 97;
    const EMPTY_ARR: string[] = [];
    const { navigation, route } = props;
    const info = route.params;
    // const navigation = useNavigation<NativeStackNavigationProp<any>>();

    let [currQuestion, setQuestion] = useState(ZERO);
    let [input, setInput] = useState(EMPTY_STRING);
    let [currSubQuestion, setSubQuestion] = useState(ZERO);
    let [results, setResults] = useState(EMPTY_ARR);

    const getQuiz = () => {
        if (info.survey === 'baseline') {
            return Baseline;
        } else if (info.survey === 'main') {
            return Main;
        } else {
            return Service;
        }
    };

    let Quiz = getQuiz();

    const setNumber = (val: string) => {
        if (/^[0-9]+$/.test(val)) {
            setInput(val);
            return;
        }
        setInput(val.slice(0, -1));
    };

    const toArray = (input: any) => {
        if (input == null) {
            return [];
        }
        if (Array.isArray(input)) {
            return input;
        }
        return [input];
    };

    const numQuizQuestions = () => {
        let numQuestions: number = 0;
        Quiz.forEach(function (question) {
            if (question.subquestion == null) {
                numQuestions++;
            } else {
                numQuestions += question.subquestion.length;
            }
        });
        return numQuestions;
    };

    const saveResponse = async (response: string) => {
        if (results.length < numQuizQuestions()) {
            results.push(response);
        }

        const nextQuestion = currQuestion + 1;
        const nextSubQuestion = currSubQuestion + 1;
        const numSubQuestions = toArray(Quiz[currQuestion].subquestion).length;

        // Subquestions exist AND current subquestion is not last subquestion
        if (numSubQuestions > 0 && nextSubQuestion < numSubQuestions) {
            setSubQuestion(nextSubQuestion);
        } else if (
            /* Current question has no subquestions OR current subquestion is last subquestion 
        AND last question not reached */
            nextSubQuestion >= numSubQuestions &&
            nextQuestion < Quiz.length
        ) {
            setQuestion(nextQuestion);
            setSubQuestion(ZERO);
        }
        // Last question reached
        else {
            // let question_id = await getQuestionSetModelId();

            console.log(info.iteration);

            const response = await axios
                .post('http://' + host + ':8080/survey_submissions/submit', {
                    Volunteer: info.id,
                    QuestionSet: '650536fd099b3e6604f3ce6d',
                    Answers: results,
                    Iteration: info.iteration,
                })
                .catch((error) => {
                    console.error(error);
                });

            navigation.navigate('Complete', { user: info.user, id: info.id });

            // console.log(response);

            // console.log(results);

            // console.log(numQuizQuestions());

            // setResults(EMPTY_ARR);

            // console.log(counter);
        }

        setInput(EMPTY_STRING);
    };

    const NoSubQuestionSelection = () => {
        return (
            <View>
                <View style={styles.optionsContainer}>
                    {toArray(Quiz[currQuestion].input).map((choice) => {
                        return (
                            <TouchableOpacity
                                key={counter++}
                                onPress={() => {
                                    saveResponse(choice);
                                }}
                                style={styles.optionContainer}
                            >
                                <Text style={styles.selection}>{choice}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.sematics}>
                    {Quiz[currQuestion].semantics?.map((meaning) => {
                        return (
                            <Text style={styles.semanticsText} key={counter++}>
                                {meaning}
                            </Text>
                        );
                    })}
                </View>
            </View>
        );
    };

    const NoSubQuestionText = () => {
        return (
            <View>
                <TextInput
                    style={styles.textBox}
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    maxLength={250}
                    multiline={true}
                />

                <TouchableOpacity
                    onPress={() => {
                        saveResponse(input);
                    }}
                    style={styles.touch}
                >
                    <EvilIcons
                        name="arrow-right"
                        size={40}
                        backgroundColor="#fff"
                        color="#EF9A9A"
                        style={styles.next}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const NoSubQuestionNumeric = () => {
        return (
            <View>
                <TextInput
                    style={styles.textBox}
                    keyboardType="numeric"
                    value={input}
                    onChangeText={(text) => setNumber(text)}
                />

                <TouchableOpacity
                    onPress={() => {
                        saveResponse(input);
                    }}
                    style={styles.touch}
                >
                    <EvilIcons
                        name="arrow-right"
                        size={40}
                        backgroundColor="#fff"
                        color="#EF9A9A"
                        style={styles.next}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const SubQuestionsSelection = () => {
        return (
            <View style={styles.sqContainer}>
                <Text style={styles.subQuestion}>
                    {String.fromCharCode(LOWERCASE_A + currSubQuestion) +
                        '. ' +
                        toArray(Quiz[currQuestion].subquestion)[
                            currSubQuestion
                        ]}
                </Text>

                <View style={styles.optionsContainer}>
                    {Array.isArray(Quiz[currQuestion].input) &&
                        toArray(Quiz[currQuestion].input).map((choice) => {
                            return (
                                <TouchableOpacity
                                    key={counter++}
                                    onPress={() => {
                                        saveResponse(choice);
                                    }}
                                    style={styles.optionContainer}
                                >
                                    <Text style={styles.selection}>
                                        {choice}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                </View>

                <View style={styles.sematics}>
                    {Quiz[currQuestion].semantics?.map((meaning) => {
                        return (
                            <Text key={counter++} style={styles.semanticsText}>
                                {meaning}
                            </Text>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor="#FFEBEE" />

            <View style={styles.top}>
                <VvVwLogos />
            </View>

            <View style={styles.middle}>
                <WeConnectLogoSmall />
            </View>

            <View style={styles.bottom}>
                <View style={styles.questionContainerTop}>
                    {/* Question */}
                    <Text style={styles.question}>
                        {Quiz[currQuestion].question}
                    </Text>

                    <View>
                        {/* Current question has no subquestions and requires selection input */}
                        {Quiz[currQuestion].subquestion == null &&
                            Array.isArray(Quiz[currQuestion].input) &&
                            NoSubQuestionSelection()}

                        {/* Current question has no subquestions and requires numeric input */}
                        {Quiz[currQuestion].subquestion == null &&
                            Quiz[currQuestion].input === 'numeric' &&
                            NoSubQuestionNumeric()}

                        {/* Current question has no subquestions and requires text input */}
                        {Quiz[currQuestion].subquestion == null &&
                            Quiz[currQuestion].input === 'text' &&
                            NoSubQuestionText()}

                        {/* Current question has no subquestions and requires a single drop down input */}
                        {Quiz[currQuestion].subquestion == null &&
                            Quiz[currQuestion].input === 'country' && (
                                <View>
                                    <CountryDropDown />

                                    <TouchableOpacity
                                        onPress={() => saveResponse('country')}
                                    >
                                        <EvilIcons
                                            name="arrow-right"
                                            size={40}
                                            color="#EF9A9A"
                                            style={styles.next}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                        {/* Current question has no subquestions and requires multi drop down input */}
                        {Quiz[currQuestion].subquestion == null &&
                            Quiz[currQuestion].input === 'language' && (
                                <View>
                                    <LanguageDropDown />

                                    <TouchableOpacity
                                        onPress={() => saveResponse('language')}
                                    >
                                        <EvilIcons
                                            name="arrow-right"
                                            size={40}
                                            backgroundColor="#fff"
                                            color="#EF9A9A"
                                            style={styles.next}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                        {/* Current question has subquestions and requires selection input */}
                        {toArray(Quiz[currQuestion].subquestion).length > 0 &&
                            SubQuestionsSelection()}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sematics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },

    semanticsText: {
        fontSize: 12,
        color: '#B71C1C',
        fontWeight: '100',
        marginHorizontal: 10,
        textAlign: 'center',
    },

    container: {
        flex: 1,
    },

    top: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFEBEE',
    },

    middle: {
        flex: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#EF9A9A',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: 'white',
    },

    bottom: {
        flex: 9.25,
        backgroundColor: '#fff',
        padding: 25,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    heading: {
        fontSize: 36,
        color: '#EF9A9A',
        fontWeight: 'bold',
        marginBottom: 7.5,
    },

    questionContainerTop: {
        borderWidth: 1,
        borderColor: '#EF9A9A',
        padding: 10,
        marginVertical: 5,
        borderRadius: 7.5,
        alignSelf: 'center',
        width: Dimensions.get('window').width / 1.1,
    },

    sqContainer: {
        borderWidth: 1,
        borderColor: '#EF9A9A',
        borderRadius: 7.5,
        marginTop: 15,
        paddingHorizontal: 10,
        paddingTop: 5,
    },

    touch: {
        width: 40,
        alignSelf: 'flex-end',
    },

    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        //borderWidth: 1,
        //borderColor: 'black',
        justifyContent: 'center',
        marginTop: 15,
    },

    optionContainer: {
        borderWidth: 1,
        borderColor: '#EF9A9A',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        margin: 5,
    },

    question: {
        color: '#B71C1C',
        fontWeight: 'bold',
        fontSize: 14,
    },

    subQuestion: {
        color: '#B71C1C',
        fontWeight: 'normal',
        fontSize: 14,
        fontStyle: 'italic',
    },

    selection: {
        color: '#B71C1C',
        //fontWeight: 'bold',
        fontSize: 14,
    },

    textBox: {
        backgroundColor: '#FFEBEE',
        fontSize: 14,
        paddingHorizontal: 7.5,
        borderWidth: 1,
        borderColor: '#EF9A9A',
        marginVertical: 15,
    },

    next: {
        alignSelf: 'flex-end',
        height: 35,
        width: 40,
    },
});

export default Survey;
