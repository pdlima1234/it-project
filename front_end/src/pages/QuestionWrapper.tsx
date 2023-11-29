type QuestionWrapperProps = {
    children: JSX.Element;
    heading: string;
};

function QuestionWrapper({ children, heading }: QuestionWrapperProps) {
    return (
        <div className="Question">
            <h3>{heading}</h3>
            {children}
        </div>
    );
}

export default QuestionWrapper;
