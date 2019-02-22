/* eslint-disable no-template-curly-in-string */

const SCHEMES = {
    action: {
        scheme: 'action',
        name: 'Argument for Action',
        criticalQuestions: [
            {
                question: "Is the current circumstance '${circumstance}' true?",
                symmetric: false
            },
            {
                question: "Does the action '${action}' achieve the goal of '${goal}'?",
                symmetric: false
            },
            {
                question: "Is there an alternative action that achieves the goal '${goal}'?",
                symmetric: true
            }
        ]
    },
    expert: {
        scheme: 'expert',
        name: 'Argument from Expert Opinion',
        criticalQuestions: [
            {
                question: "How credible is '${source}' an expert?",
                symmetric: false
            },
            {
                question: "Is '${source}' an expert in the field that the assertion '${assertion}' is in?",
                symmetric: false
            },
            {
                question: "Is the assertion '${assertion}' consistent with what other experts assert?",
                symmetric: true
            }
        ]
    },
    popular: {
        scheme: 'popular',
        name: 'Argument from Popular Opinion',
        criticalQuestions: [
            {
                question: "What evidence do we have for believing that '${proposition}' is generally accepted?",
                symmetric: false
            },
            {
                question: "Are there good reasons for doubting the accuracy of '${proposition}'?",
                symmetric: false
            }
        ]
    }
}

export default SCHEMES;