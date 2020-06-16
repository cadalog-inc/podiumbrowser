import React from 'react';

export class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.dragDropRef = React.createRef();
        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                <div
                    ref={this.dragDropRef}
                    onDragEnter={(e) => {
                        this.dragDropRef.current.textContent = '';
                        e.stopPropagation();
                    }}
                    onDragOver={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onDrop={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.doDrop(e);
                    }}
                    style={{
                        width: 300,
                        height: 300,
                        backgroundColor: '#ddd'
                    }}
                >
                    DROP FILES HERE FROM FINDER OR EXPLORER
                </div>
            </React.Fragment>
        )
    }

    doDrop = (e) => {
        var dt = e.dataTransfer;
        var files = dt.files;

        var count = files.length;
        this.output(`File Count: ${count} <br/>`);

        for (var i = 0; i < files.length; i++) {
            this.output(` File ${i}: <br/>(${(typeof files[i])}) : <${files[i]} > ${files[i].name} ${files[i].size}<br/>`);
        }
    }

    output(text) {
        this.dragDropRef.current.innerHTML += text;
    }
}